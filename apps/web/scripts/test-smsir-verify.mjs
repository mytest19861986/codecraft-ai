import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SMSIR_VERIFY_ENDPOINT = "https://api.sms.ir/v1/send/verify";
const SMSIR_TIMEOUT_MS = 8_000;
const TEST_CODE = "12345";

function loadEnvFile(filePath) {
  let contents = "";

  try {
    contents = readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseTemplateId(value) {
  if (!value) {
    return undefined;
  }

  const templateId = Number(value);
  return Number.isInteger(templateId) && templateId > 0 ? templateId : undefined;
}

function normalizeIranMobile(mobile) {
  const compact = mobile.trim().replace(/[\s\-()]/g, "");
  const digits = compact.startsWith("+") ? compact.slice(1) : compact;

  if (!/^\d+$/.test(digits)) {
    return undefined;
  }

  if (digits.startsWith("09") && digits.length === 11) {
    return digits.slice(1);
  }

  if (digits.startsWith("989") && digits.length === 12) {
    return digits.slice(2);
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return digits;
  }

  return undefined;
}

function readProviderResponse(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}

function safePrint(result) {
  const output = {
    ok: result.ok,
  };

  for (const key of ["httpStatus", "providerStatus", "message", "data", "error"]) {
    if (result[key] !== undefined) {
      output[key] = result[key];
    }
  }

  console.log(JSON.stringify(output, null, 2));
}

async function sendVerifyTest() {
  const mode = process.env.SMSIR_MODE;
  const apiKey = process.env.SMSIR_API_KEY;
  const templateId = parseTemplateId(process.env.SMSIR_VERIFY_TEMPLATE_ID);
  const rawMobile = process.env.SMSIR_TEST_MOBILE;
  const mobile = rawMobile ? normalizeIranMobile(rawMobile) : undefined;

  if (mode !== "sandbox" && mode !== "production") {
    return { ok: false, error: "SMSIR_CONFIG_MISSING" };
  }

  if (mode === "production" && process.env.SMSIR_REAL_SEND_ENABLED !== "true") {
    return { ok: false, error: "SMSIR_REAL_SEND_NOT_ENABLED" };
  }

  if (!apiKey || !templateId) {
    return { ok: false, error: "SMSIR_CONFIG_MISSING" };
  }

  if (!mobile) {
    return { ok: false, error: "SMSIR_INVALID_MOBILE" };
  }

  if (mode === "production") {
    console.error("Production SMS test: a real SMS may be sent and credit may be charged.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SMSIR_TIMEOUT_MS);

  try {
    const response = await fetch(SMSIR_VERIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        mobile,
        templateId,
        parameters: [
          {
            name: "Code",
            value: TEST_CODE,
          },
        ],
      }),
      signal: controller.signal,
    });

    const httpStatus = response.status;
    const body = readProviderResponse(await response.text());

    if (!body) {
      return { ok: false, httpStatus, error: "SMSIR_INVALID_RESPONSE" };
    }

    const providerStatus = typeof body.status === "number" ? body.status : undefined;
    const message = typeof body.message === "string" ? body.message : undefined;
    const result = {
      ok: httpStatus === 200 && providerStatus === 1,
      httpStatus,
      providerStatus,
      message,
      data: body.data,
    };

    if (!result.ok) {
      result.error = "SMSIR_PROVIDER_FAILED";
    }

    return result;
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, error: "SMSIR_TIMEOUT" };
    }

    return { ok: false, error: "SMSIR_REQUEST_FAILED" };
  } finally {
    clearTimeout(timeout);
  }
}

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
loadEnvFile(resolve(scriptDir, "../.env"));

const result = await sendVerifyTest();
safePrint(result);
process.exit(result.ok ? 0 : 1);

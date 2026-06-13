import "server-only";

const SMSIR_VERIFY_ENDPOINT = "https://api.sms.ir/v1/send/verify";
const SMSIR_TIMEOUT_MS = 8_000;
const LEAD_CONFIRMATION_PARAMETERS = [
  {
    name: "Code",
    value: "ثبت‌نام",
  },
];

export type SmsIrVerifyResult = {
  ok: boolean;
  httpStatus?: number;
  providerStatus?: number;
  message?: string;
  data?: unknown;
  error?: string;
};

type SmsIrVerifyResponse = {
  status?: unknown;
  message?: unknown;
  data?: unknown;
};

function parseTemplateId(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const templateId = Number(value);
  return Number.isInteger(templateId) && templateId > 0 ? templateId : undefined;
}

function normalizeIranMobile(mobile: string): string | undefined {
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

function maskMobileForLog(mobile: string): string {
  const compact = mobile.trim().replace(/[\s\-()]/g, "");
  const digits = compact.startsWith("+") ? compact.slice(1) : compact;
  let localMobile: string | undefined;

  if (digits.startsWith("09") && digits.length === 11) {
    localMobile = digits;
  } else if (digits.startsWith("989") && digits.length === 12) {
    localMobile = `0${digits.slice(2)}`;
  } else if (digits.startsWith("9") && digits.length === 10) {
    localMobile = `0${digits}`;
  }

  if (!localMobile) {
    return "***";
  }

  return `${localMobile.slice(0, 4)}***${localMobile.slice(-4)}`;
}

function readProviderResponse(text: string): SmsIrVerifyResponse | undefined {
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export async function sendSmsIrVerifyCode(input: {
  mobile: string;
  code: string;
  templateId?: number;
  parameters?: Array<{ name: string; value: string }>;
  allowProductionSend?: boolean;
}): Promise<SmsIrVerifyResult> {
  const mode = process.env.SMSIR_MODE;
  const apiKey = process.env.SMSIR_API_KEY;
  const templateId = input.templateId ?? parseTemplateId(process.env.SMSIR_VERIFY_TEMPLATE_ID);
  const mobile = normalizeIranMobile(input.mobile);

  if (mode !== "sandbox" && mode !== "production") {
    return { ok: false, error: "SMSIR_CONFIG_MISSING" };
  }

  if (
    mode === "production" &&
    process.env.SMSIR_REAL_SEND_ENABLED !== "true" &&
    input.allowProductionSend !== true
  ) {
    return { ok: false, error: "SMSIR_REAL_SEND_NOT_ENABLED" };
  }

  if (!apiKey || !templateId) {
    return { ok: false, error: "SMSIR_CONFIG_MISSING" };
  }

  if (!mobile) {
    return { ok: false, error: "SMSIR_INVALID_MOBILE" };
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
        parameters: input.parameters ?? [
          {
            name: "Code",
            value: input.code,
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
    const result: SmsIrVerifyResult = {
      ok: response.status === 200 && providerStatus === 1,
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

export async function sendLeadConfirmationSms(input: {
  mobile: string;
  name?: string;
}): Promise<void> {
  const mobile = maskMobileForLog(input.mobile);

  if (process.env.SMS_LEAD_SMS_ENABLED !== "true") {
    console.info("[smsir] lead sms skipped: disabled", { mobile });
    return;
  }

  const templateId = parseTemplateId(process.env.SMS_LEAD_TEMPLATE_ID);

  if (!templateId) {
    console.warn("[smsir] lead sms skipped: missing template", { mobile });
    return;
  }

  try {
    console.info("[smsir] lead sms attempted", { mobile });

    const result = await sendSmsIrVerifyCode({
      mobile: input.mobile,
      code: LEAD_CONFIRMATION_PARAMETERS[0].value,
      templateId,
      parameters: LEAD_CONFIRMATION_PARAMETERS,
    });

    if (!result.ok) {
      console.warn("[smsir] lead sms failed", {
        mobile,
        error: result.error,
        httpStatus: result.httpStatus,
        providerStatus: result.providerStatus,
        message: result.message,
      });
      return;
    }

    console.info("[smsir] lead sms success", {
      mobile,
      httpStatus: result.httpStatus,
      providerStatus: result.providerStatus,
      message: result.message,
    });
  } catch (error) {
    console.warn("[smsir] lead sms failed", {
      mobile,
      error: error instanceof Error ? error.name : "UnknownError",
    });
  }
}

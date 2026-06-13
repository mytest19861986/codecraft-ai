import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookieOptions,
  createAdminSessionCookieValue
} from "@/lib/security/admin-session";
import { adminRedirectUrl } from "@/lib/security/admin-redirect";

function isJsonRequest(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const accept = request.headers.get("accept") ?? "";

  return contentType.includes("application/json") || accept.includes("application/json");
}

async function readPassword(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
    return typeof body?.password === "string" ? body.password : "";
  }

  const formData = await request.formData().catch(() => null);
  const password = formData?.get("password");

  return typeof password === "string" ? password : "";
}

function hashPasswordDigest(password: string) {
  return createHash("sha256").update(password, "utf8").digest();
}

function isAdminPasswordMatch(submittedPassword: string, adminPassword: string) {
  return timingSafeEqual(hashPasswordDigest(submittedPassword), hashPasswordDigest(adminPassword));
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionValue = createAdminSessionCookieValue();
  const wantsJson = isJsonRequest(request);

  if (!adminPassword || !process.env.ADMIN_SESSION_SECRET || !sessionValue) {
    if (wantsJson) {
      return NextResponse.json({ error: "AUTH_UNAVAILABLE" }, { status: 500 });
    }

    return NextResponse.redirect(adminRedirectUrl(request, "/admin/login?error=unavailable"), {
      status: 303
    });
  }

  const password = await readPassword(request);

  if (!isAdminPasswordMatch(password, adminPassword)) {
    if (wantsJson) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    return NextResponse.redirect(adminRedirectUrl(request, "/admin/login?error=invalid"), { status: 303 });
  }

  const response = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(adminRedirectUrl(request, "/admin/leads"), { status: 303 });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionValue, adminSessionCookieOptions());

  return response;
}

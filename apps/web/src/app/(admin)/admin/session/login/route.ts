import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookieOptions,
  createAdminSessionCookieValue
} from "@/lib/security/admin-session";

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

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionValue = createAdminSessionCookieValue();
  const wantsJson = isJsonRequest(request);

  if (!adminPassword || !process.env.ADMIN_SESSION_SECRET || !sessionValue) {
    return NextResponse.json({ error: "ADMIN_AUTH_NOT_CONFIGURED" }, { status: 500 });
  }

  const password = await readPassword(request);

  if (password !== adminPassword) {
    if (wantsJson) {
      return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), { status: 303 });
  }

  const response = wantsJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/admin/leads", request.url), { status: 303 });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, sessionValue, adminSessionCookieOptions());

  return response;
}

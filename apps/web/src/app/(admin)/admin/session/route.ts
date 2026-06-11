import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE_NAME, adminSessionCookieOptions } from "@/lib/security/admin-session";

function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", adminSessionCookieOptions(0));
  return response;
}

export async function DELETE() {
  return clearAdminSessionCookie(NextResponse.json({ ok: true }));
}

export async function POST(request: NextRequest) {
  return clearAdminSessionCookie(
    NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 })
  );
}

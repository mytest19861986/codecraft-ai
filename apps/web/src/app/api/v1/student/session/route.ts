import { NextResponse } from "next/server";
import {
  STUDENT_SESSION_COOKIE_NAME,
  studentSessionCookieOptions
} from "@/lib/security/student-session";

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(STUDENT_SESSION_COOKIE_NAME, "", studentSessionCookieOptions(0));

  return response;
}

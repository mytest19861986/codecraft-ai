import {
  createSignedSessionValue,
  sessionCookieOptions,
  verifySignedSessionValue,
  type SessionTimestampPayload
} from "@/lib/security/session-core";

export const ADMIN_SESSION_COOKIE_NAME = "codecraft_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

// Existing admin cookies intentionally use lowercase "admin"; future shared
// student/admin sessions may use uppercase SessionRole values such as "ADMIN"
// and "STUDENT".
type AdminSessionPayload = SessionTimestampPayload & {
  role: "admin";
};

export type AdminSession = AdminSessionPayload;

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function isAdminSessionPayload(payload: Partial<AdminSessionPayload>): payload is AdminSessionPayload {
  return payload.role === "admin" && typeof payload.iat === "number" && typeof payload.exp === "number";
}

export function adminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return sessionCookieOptions(maxAge);
}

export function createAdminSessionCookieValue() {
  const secret = getAdminSessionSecret();

  if (!secret) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    role: "admin",
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS
  };

  return createSignedSessionValue(payload, secret);
}

export function verifyAdminSessionCookie(value: string | undefined) {
  return verifySignedSessionValue({
    value,
    secret: getAdminSessionSecret(),
    validatePayload: isAdminSessionPayload
  });
}

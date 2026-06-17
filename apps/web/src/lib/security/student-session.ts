import {
  createSignedSessionValue,
  sessionCookieOptions,
  verifySignedSessionValue,
  type SharedSessionPayload
} from "@/lib/security/session-core";

export const STUDENT_SESSION_COOKIE_NAME = "codecraft_student_session";
export const STUDENT_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type StudentSession = SharedSessionPayload & {
  role: "STUDENT";
};

function getStudentSessionSecret() {
  return process.env.STUDENT_SESSION_SECRET;
}

function isStudentSessionPayload(payload: Partial<StudentSession>): payload is StudentSession {
  return (
    typeof payload.sub === "string" &&
    payload.sub.length > 0 &&
    payload.role === "STUDENT" &&
    typeof payload.iat === "number" &&
    typeof payload.exp === "number"
  );
}

export function studentSessionCookieOptions(maxAge = STUDENT_SESSION_MAX_AGE_SECONDS) {
  return sessionCookieOptions(maxAge);
}

export function createStudentSessionCookieValue(userId: string) {
  const secret = getStudentSessionSecret();

  if (!secret) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: StudentSession = {
    sub: userId,
    role: "STUDENT",
    iat: now,
    exp: now + STUDENT_SESSION_MAX_AGE_SECONDS
  };

  return createSignedSessionValue(payload, secret);
}

export function verifyStudentSessionCookie(value: string | undefined) {
  return verifySignedSessionValue({
    value,
    secret: getStudentSessionSecret(),
    validatePayload: isStudentSessionPayload
  });
}

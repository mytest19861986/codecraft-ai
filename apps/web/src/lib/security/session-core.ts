import { createHmac, timingSafeEqual } from "node:crypto";

export type SessionRole = "STUDENT" | "ADMIN";

export type SharedSessionPayload = {
  sub: string;
  role: SessionRole;
  iat: number;
  exp: number;
};

export type SessionTimestampPayload = {
  iat: number;
  exp: number;
};

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "strict";
  path: "/";
  maxAge?: number;
};

type VerifySignedSessionOptions<TPayload extends SessionTimestampPayload> = {
  value: string | undefined;
  secret: string | undefined;
  validatePayload: (payload: Partial<TPayload>) => payload is TPayload;
};

export function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

export function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signSessionPayload(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function signaturesMatch(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function sessionCookieOptions(maxAge?: number): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {})
  };
}

export function createSignedSessionValue<TPayload extends SessionTimestampPayload>(
  payload: TPayload,
  secret: string
) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signSessionPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifySignedSessionValue<TPayload extends SessionTimestampPayload>({
  value,
  secret,
  validatePayload
}: VerifySignedSessionOptions<TPayload>) {
  if (!secret || !value) {
    return null;
  }

  const parts = value.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(encodedPayload, secret);

  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<TPayload>;
    const now = Math.floor(Date.now() / 1000);

    if (!validatePayload(payload)) {
      return null;
    }

    if (!Number.isFinite(payload.iat) || !Number.isFinite(payload.exp)) {
      return null;
    }

    if (payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

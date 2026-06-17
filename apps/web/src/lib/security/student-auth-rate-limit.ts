const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  codecraftStudentAuthRateLimit?: Map<string, RateLimitEntry>;
};

const studentAuthRateLimit =
  globalForRateLimit.codecraftStudentAuthRateLimit ?? new Map<string, RateLimitEntry>();
globalForRateLimit.codecraftStudentAuthRateLimit = studentAuthRateLimit;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

export function checkStudentAuthRateLimit(key: string) {
  const now = Date.now();
  const entry = studentAuthRateLimit.get(key);

  if (!entry || entry.resetAt <= now) {
    studentAuthRateLimit.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

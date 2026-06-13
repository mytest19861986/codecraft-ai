import type { NextRequest } from "next/server";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function isLocalhostOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

function getConfiguredSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return null;
  }

  try {
    return new URL(siteUrl).origin;
  } catch {
    return null;
  }
}

function getRequestHeaderOrigin(request: NextRequest) {
  const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
  const host = forwardedHost ?? firstHeaderValue(request.headers.get("host"));

  if (!host) {
    return null;
  }

  const forwardedProto = firstHeaderValue(request.headers.get("x-forwarded-proto"));
  const protocol = forwardedProto === "http" || forwardedProto === "https" ? forwardedProto : "http";

  return `${protocol}://${host}`;
}

export function adminRedirectUrl(request: NextRequest, pathname: string) {
  const headerOrigin = getRequestHeaderOrigin(request);
  const configuredSiteOrigin = getConfiguredSiteOrigin();
  const origin =
    headerOrigin && !(configuredSiteOrigin && isLocalhostOrigin(headerOrigin))
      ? headerOrigin
      : configuredSiteOrigin;

  return origin ? new URL(pathname, origin) : pathname;
}

import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.method === "POST" && request.nextUrl.pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/session/login";

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/login"
};

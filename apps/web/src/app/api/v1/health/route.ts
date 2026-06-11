import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "codecraft-web",
    version: process.env.npm_package_version ?? "0.1.0",
    timestamp: new Date().toISOString()
  });
}

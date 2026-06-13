import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { sendLeadConfirmationSms } from "@/lib/sms/sms-ir";
import { leadCreateSchema } from "@/lib/validators/lead";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  codecraftLeadRateLimit?: Map<string, RateLimitEntry>;
};

const leadRateLimit = globalForRateLimit.codecraftLeadRateLimit ?? new Map<string, RateLimitEntry>();
globalForRateLimit.codecraftLeadRateLimit = leadRateLimit;

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = leadRateLimit.get(ip);

  if (!entry || entry.resetAt <= now) {
    leadRateLimit.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json({ error: "RATE_LIMIT_EXCEEDED" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const result = leadCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "VALIDATION_ERROR",
          issues: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const lead = await prisma.bootcampLead.create({
      data: result.data,
      select: {
        id: true,
        fullName: true,
        phone: true,
        ageRange: true,
        skillLevel: true,
        status: true,
        createdAt: true
      }
    });

    await sendLeadConfirmationSms({
      mobile: lead.phone,
      name: lead.fullName
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "DUPLICATE_PHONE" }, { status: 409 });
    }

    return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
  }
}

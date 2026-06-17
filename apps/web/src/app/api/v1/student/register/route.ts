import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/security/password";
import { checkStudentAuthRateLimit, getClientIp } from "@/lib/security/student-auth-rate-limit";
import { studentRegisterSchema } from "@/lib/validators/student-auth";

function errorResponse(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(details ? { details } : {})
      }
    },
    { status }
  );
}

function isDuplicatePhoneError(error: unknown) {
  if (typeof error !== "object" || error === null || !("code" in error) || error.code !== "P2002") {
    return false;
  }

  const target = "meta" in error && typeof error.meta === "object" && error.meta !== null && "target" in error.meta
    ? error.meta.target
    : null;

  return Array.isArray(target) && target.includes("phone");
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkStudentAuthRateLimit(`register:${clientIp}`)) {
    return errorResponse("RATE_LIMIT_EXCEEDED", "Too many attempts. Please try again later.", 429);
  }

  try {
    const body = await request.json().catch(() => null);
    const result = studentRegisterSchema.safeParse(body);

    if (!result.success) {
      return errorResponse(
        "VALIDATION_ERROR",
        "Invalid registration input.",
        400,
        result.error.flatten().fieldErrors
      );
    }

    const passwordHash = await hashPassword(result.data.password);
    const user = await prisma.user.create({
      data: {
        name: result.data.name,
        phone: result.data.phone,
        role: UserRole.STUDENT,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
  } catch (error) {
    if (isDuplicatePhoneError(error)) {
      return errorResponse("DUPLICATE_PHONE", "A student account with this phone already exists.", 409);
    }

    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}

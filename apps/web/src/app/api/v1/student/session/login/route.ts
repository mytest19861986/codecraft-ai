import { NextResponse } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/security/password";
import { checkStudentAuthRateLimit, getClientIp } from "@/lib/security/student-auth-rate-limit";
import {
  STUDENT_SESSION_COOKIE_NAME,
  createStudentSessionCookieValue,
  studentSessionCookieOptions
} from "@/lib/security/student-session";
import { studentLoginSchema } from "@/lib/validators/student-auth";

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

export async function POST(request: Request) {
  const clientIp = getClientIp(request);

  if (!checkStudentAuthRateLimit(`login:${clientIp}`)) {
    return errorResponse("RATE_LIMIT_EXCEEDED", "Too many attempts. Please try again later.", 429);
  }

  try {
    const body = await request.json().catch(() => null);
    const result = studentLoginSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("VALIDATION_ERROR", "Invalid login input.", 400, result.error.flatten().fieldErrors);
    }

    const user = await prisma.user.findUnique({
      where: {
        phone: result.data.phone
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        passwordHash: true,
        createdAt: true
      }
    });

    if (user?.role !== UserRole.STUDENT || !user.passwordHash) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid phone or password.", 401);
    }

    const isPasswordValid = await verifyPassword(result.data.password, user.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("INVALID_CREDENTIALS", "Invalid phone or password.", 401);
    }

    const sessionValue = createStudentSessionCookieValue(user.id);

    if (!sessionValue) {
      return errorResponse("AUTH_UNAVAILABLE", "Authentication is unavailable.", 500);
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };
    const response = NextResponse.json({ ok: true, user: safeUser });

    response.cookies.set(STUDENT_SESSION_COOKIE_NAME, sessionValue, studentSessionCookieOptions());

    return response;
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}

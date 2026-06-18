import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { STUDENT_SESSION_COOKIE_NAME, verifyStudentSessionCookie } from "@/lib/security/student-session";

function unauthenticatedResponse() {
  return NextResponse.json(
    {
      ok: false,
      authenticated: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required."
      }
    },
    { status: 401 }
  );
}

function errorResponse(code: string, message: string, status: number) {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message
      }
    },
    { status }
  );
}

export async function GET(request: NextRequest) {
  const session = verifyStudentSessionCookie(request.cookies.get(STUDENT_SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return unauthenticatedResponse();
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.sub
      },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        xp: true,
        level: true,
        createdAt: true
      }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      return unauthenticatedResponse();
    }

    return NextResponse.json({ ok: true, authenticated: true, user });
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}

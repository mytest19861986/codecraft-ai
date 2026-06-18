import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { STUDENT_SESSION_COOKIE_NAME, verifyStudentSessionCookie } from "@/lib/security/student-session";
import { completeStudentLesson, LessonCompletionError } from "@/lib/student/lesson-completion";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

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

export async function POST(request: NextRequest, context: RouteContext) {
  const session = verifyStudentSessionCookie(request.cookies.get(STUDENT_SESSION_COOKIE_NAME)?.value);

  if (!session) {
    return unauthenticatedResponse();
  }

  try {
    const { slug } = await context.params;
    const user = await prisma.user.findUnique({
      where: {
        id: session.sub
      },
      select: {
        id: true,
        role: true
      }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      return unauthenticatedResponse();
    }

    const result = await completeStudentLesson(user.id, slug);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LessonCompletionError) {
      return errorResponse(error.code, error.message, error.status);
    }

    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}

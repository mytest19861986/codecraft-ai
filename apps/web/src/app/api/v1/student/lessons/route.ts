import { NextResponse, type NextRequest } from "next/server";
import { UserRole } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { STUDENT_SESSION_COOKIE_NAME, verifyStudentSessionCookie } from "@/lib/security/student-session";
import { getStudentLessonPath } from "@/lib/student/lessons";

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
        role: true
      }
    });

    if (!user || user.role !== UserRole.STUDENT) {
      return unauthenticatedResponse();
    }

    const lessons = await getStudentLessonPath(user.id);

    return NextResponse.json({
      ok: true,
      authenticated: true,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        contentPreview: lesson.contentPreview,
        hasContent: lesson.hasContent,
        order: lesson.order,
        xpReward: lesson.xpReward,
        status: lesson.status,
        completedAt: lesson.completedAt ? lesson.completedAt.toISOString() : null
      }))
    });
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "Internal server error.", 500);
  }
}

import { NextResponse, type NextRequest } from "next/server";
import {
  deleteAdminLesson,
  isAdminLessonInput,
  readLessonInput,
  serializeAdminLesson,
  updateAdminLesson
} from "@/lib/admin/lessons";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function unauthenticatedResponse() {
  return NextResponse.json(
    {
      ok: false,
      authenticated: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "ورود مدیر الزامی است."
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

function isAdminRequest(request: NextRequest) {
  return Boolean(verifyAdminSessionCookie(request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return errorResponse("INVALID_JSON", "بدنه درخواست معتبر نیست.", 400);
  }

  const input = readLessonInput(body);

  if (!isAdminLessonInput(input)) {
    return errorResponse(input.code, input.message, input.status);
  }

  const result = await updateAdminLesson(id, input);

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    lesson: serializeAdminLesson(result.lesson)
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return unauthenticatedResponse();
  }

  const { id } = await context.params;
  const result = await deleteAdminLesson(id);

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    lesson: result.lesson
  });
}

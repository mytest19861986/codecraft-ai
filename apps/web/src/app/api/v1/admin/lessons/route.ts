import { NextResponse, type NextRequest } from "next/server";
import {
  createAdminLesson,
  isAdminLessonInput,
  listAdminLessons,
  readLessonInput,
  serializeAdminLesson
} from "@/lib/admin/lessons";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

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

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthenticatedResponse();
  }

  try {
    const lessons = await listAdminLessons();

    return NextResponse.json({
      ok: true,
      authenticated: true,
      lessons: lessons.map(serializeAdminLesson)
    });
  } catch {
    return errorResponse("INTERNAL_SERVER_ERROR", "خطای داخلی سرور رخ داد.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthenticatedResponse();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return errorResponse("INVALID_JSON", "بدنه درخواست معتبر نیست.", 400);
  }

  const input = readLessonInput(body);

  if (!isAdminLessonInput(input)) {
    return errorResponse(input.code, input.message, input.status);
  }

  const result = await createAdminLesson(input);

  if (!result.ok) {
    return errorResponse(result.code, result.message, result.status);
  }

  return NextResponse.json(
    {
      ok: true,
      authenticated: true,
      lesson: serializeAdminLesson(result.lesson)
    },
    { status: 201 }
  );
}

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type AdminLessonInput = {
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  xpReward: number;
  order: number;
  isActive: boolean;
};

export type AdminLessonFailure = {
  ok: false;
  status: number;
  code: string;
  message: string;
};

export type AdminLessonResult =
  | {
      ok: true;
      lesson: AdminLesson;
    }
  | AdminLessonFailure;

export type AdminLesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const adminLessonSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  content: true,
  videoUrl: true,
  order: true,
  xpReward: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.LessonSelect;

const LESSON_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function trimOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseOptionalUrl(value: unknown) {
  const trimmed = trimOptionalText(value);

  if (!trimmed) {
    return {
      ok: true as const,
      value: null
    };
  }

  try {
    const url = new URL(trimmed);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return {
        ok: false as const,
        error: "آدرس ویدیو باید با http یا https شروع شود."
      };
    }

    return {
      ok: true as const,
      value: trimmed
    };
  } catch {
    return {
      ok: false as const,
      error: "فرمت آدرس ویدیو معتبر نیست."
    };
  }
}

function parseInteger(value: unknown) {
  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function parseBoolean(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

export function normalizeLessonSlug(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function readLessonInput(input: FormData | Record<string, unknown>): AdminLessonInput | AdminLessonFailure {
  const getValue = (key: string) => (input instanceof FormData ? input.get(key) : input[key]);
  const title = typeof getValue("title") === "string" ? String(getValue("title")).trim() : "";
  const slug = normalizeLessonSlug(getValue("slug"));
  const xpReward = parseInteger(getValue("xpReward"));
  const order = parseInteger(getValue("order"));
  const videoUrl = parseOptionalUrl(getValue("videoUrl"));

  if (!title) {
    return validationError("عنوان درس الزامی است.");
  }

  if (!slug) {
    return validationError("اسلاگ درس الزامی است.");
  }

  if (!LESSON_SLUG_PATTERN.test(slug)) {
    return validationError("اسلاگ فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره بین کلمات باشد.");
  }

  if (!videoUrl.ok) {
    return validationError(videoUrl.error);
  }

  if (xpReward === null || xpReward < 0 || xpReward > 500) {
    return validationError("پاداش XP باید یک عدد صحیح بین ۰ تا ۵۰۰ باشد.");
  }

  if (order === null || order < 1) {
    return validationError("ترتیب درس باید یک عدد صحیح مثبت باشد.");
  }

  return {
    title,
    slug,
    description: trimOptionalText(getValue("description")),
    content: trimOptionalText(getValue("content")),
    videoUrl: videoUrl.value,
    xpReward,
    order,
    isActive: parseBoolean(getValue("isActive") ?? getValue("active"))
  };
}

export function isAdminLessonInput(input: AdminLessonInput | AdminLessonFailure): input is AdminLessonInput {
  return !("ok" in input);
}

export function serializeAdminLesson(lesson: AdminLesson) {
  return {
    ...lesson,
    hasContent: Boolean(lesson.content?.trim()),
    createdAt: lesson.createdAt.toISOString(),
    updatedAt: lesson.updatedAt.toISOString()
  };
}

export async function listAdminLessons() {
  return prisma.lesson.findMany({
    orderBy: [
      {
        order: "asc"
      },
      {
        createdAt: "desc"
      }
    ],
    select: adminLessonSelect
  });
}

export async function getAdminLesson(id: string) {
  return prisma.lesson.findUnique({
    where: {
      id
    },
    select: adminLessonSelect
  });
}

export async function createAdminLesson(input: AdminLessonInput): Promise<AdminLessonResult> {
  const duplicate = await findDuplicateLesson(input.slug, input.order);

  if (duplicate) {
    return duplicateLessonError(duplicate);
  }

  try {
    const lesson = await prisma.lesson.create({
      data: input,
      select: adminLessonSelect
    });

    return {
      ok: true,
      lesson
    };
  } catch (error) {
    return writeLessonError(error);
  }
}

export async function updateAdminLesson(id: string, input: AdminLessonInput): Promise<AdminLessonResult> {
  const currentLesson = await getAdminLesson(id);

  if (!currentLesson) {
    return {
      ok: false,
      status: 404,
      code: "LESSON_NOT_FOUND",
      message: "درس پیدا نشد."
    };
  }

  const duplicate = await findDuplicateLesson(input.slug, input.order, id);

  if (duplicate) {
    return duplicateLessonError(duplicate);
  }

  try {
    const lesson = await prisma.lesson.update({
      where: {
        id
      },
      data: input,
      select: adminLessonSelect
    });

    return {
      ok: true,
      lesson
    };
  } catch (error) {
    return writeLessonError(error);
  }
}

function validationError(message: string): AdminLessonFailure {
  return {
    ok: false,
    status: 400,
    code: "VALIDATION_ERROR",
    message
  };
}

async function findDuplicateLesson(slug: string, order: number, exceptId?: string) {
  const duplicate = await prisma.lesson.findFirst({
    where: {
      ...(exceptId
        ? {
            id: {
              not: exceptId
            }
          }
        : {}),
      OR: [
        {
          slug
        },
        {
          order
        }
      ]
    },
    select: {
      slug: true,
      order: true
    }
  });

  if (!duplicate) {
    return null;
  }

  return duplicate.slug === slug ? "slug" : "order";
}

function duplicateLessonError(duplicate: "slug" | "order"): AdminLessonResult {
  if (duplicate === "slug") {
    return {
      ok: false,
      status: 409,
      code: "DUPLICATE_SLUG",
      message: "اسلاگ واردشده قبلا برای یک درس دیگر ثبت شده است."
    };
  }

  return {
    ok: false,
    status: 409,
    code: "DUPLICATE_ORDER",
    message: "این شماره ترتیب قبلا برای یک درس دیگر ثبت شده است."
  };
}

function writeLessonError(error: unknown): AdminLessonResult {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        ok: false,
        status: 409,
        code: "DUPLICATE_SLUG",
        message: "اسلاگ واردشده قبلا برای یک درس دیگر ثبت شده است."
      };
    }

    if (error.code === "P2025") {
      return {
        ok: false,
        status: 404,
        code: "LESSON_NOT_FOUND",
        message: "درس پیدا نشد."
      };
    }
  }

  return {
    ok: false,
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "خطای داخلی سرور رخ داد."
  };
}

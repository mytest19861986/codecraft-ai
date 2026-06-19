import { LessonStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";

export type StudentLessonPathItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  contentPreview: string | null;
  hasContent: boolean;
  order: number;
  xpReward: number;
  status: LessonStatus;
  completedAt: Date | null;
};

function createContentPreview(content: string | null): string | null {
  const normalizedContent = content?.replace(/\s+/g, " ").trim();

  if (!normalizedContent) {
    return null;
  }

  return normalizedContent.length > 120 ? `${normalizedContent.slice(0, 120)}...` : normalizedContent;
}

export async function getStudentLessonPath(userId: string): Promise<StudentLessonPathItem[]> {
  const lessons = await prisma.lesson.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      order: "asc"
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      content: true,
      order: true,
      xpReward: true
    }
  });

  if (lessons.length === 0) {
    return [];
  }

  const progress = await prisma.userLessonProgress.findMany({
    where: {
      userId,
      lessonId: {
        in: lessons.map((lesson) => lesson.id)
      }
    },
    select: {
      lessonId: true,
      status: true,
      completedAt: true
    }
  });

  const progressByLessonId = new Map(progress.map((item) => [item.lessonId, item]));
  const hasAnyProgress = progress.length > 0;

  return lessons.map((lesson, index) => {
    const existingProgress = progressByLessonId.get(lesson.id);

    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      description: lesson.description,
      contentPreview: createContentPreview(lesson.content),
      hasContent: Boolean(lesson.content?.trim()),
      order: lesson.order,
      xpReward: lesson.xpReward,
      status: existingProgress?.status ?? (!hasAnyProgress && index === 0 ? LessonStatus.UNLOCKED : LessonStatus.LOCKED),
      completedAt: existingProgress?.completedAt ?? null
    };
  });
}

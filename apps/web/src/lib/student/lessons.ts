import { LessonStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";

export type StudentLessonPathItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  xpReward: number;
  status: LessonStatus;
  completedAt: Date | null;
};

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
      ...lesson,
      status: existingProgress?.status ?? (!hasAnyProgress && index === 0 ? LessonStatus.UNLOCKED : LessonStatus.LOCKED),
      completedAt: existingProgress?.completedAt ?? null
    };
  });
}

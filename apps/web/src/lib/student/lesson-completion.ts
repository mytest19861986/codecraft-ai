import { LessonStatus } from "@/generated/prisma/enums";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

const XP_PER_LEVEL = 100;

type CompletionErrorCode = "LESSON_NOT_FOUND" | "LESSON_LOCKED";

export class LessonCompletionError extends Error {
  constructor(
    public readonly code: CompletionErrorCode,
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

type LessonSummary = {
  id: string;
  slug: string;
  title: string;
  order: number;
  xpReward: number;
  status: LessonStatus;
  completedAt: string | null;
};

type CompletionResult = {
  ok: true;
  lesson: LessonSummary;
  xpAwarded: number;
  user: {
    xp: number;
    level: number;
  };
  nextLesson: LessonSummary | null;
};

function getLevelForXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function toLessonSummary(
  lesson: {
    id: string;
    slug: string;
    title: string;
    order: number;
    xpReward: number;
  },
  status: LessonStatus,
  completedAt: Date | null
): LessonSummary {
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    order: lesson.order,
    xpReward: lesson.xpReward,
    status,
    completedAt: completedAt ? completedAt.toISOString() : null
  };
}

function isRetryableTransactionError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2034";
}

async function runCompletionTransaction(userId: string, slug: string): Promise<CompletionResult> {
  return prisma.$transaction(
    async (tx) => {
      const lesson = await tx.lesson.findFirst({
        where: {
          slug,
          isActive: true
        },
        select: {
          id: true,
          slug: true,
          title: true,
          order: true,
          xpReward: true
        }
      });

      if (!lesson) {
        throw new LessonCompletionError("LESSON_NOT_FOUND", "Lesson not found.", 404);
      }

      const [firstActiveLesson, existingProgress, activeProgressCount, user] = await Promise.all([
        tx.lesson.findFirst({
          where: {
            isActive: true
          },
          orderBy: {
            order: "asc"
          },
          select: {
            id: true
          }
        }),
        tx.userLessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId: lesson.id
            }
          },
          select: {
            id: true,
            status: true,
            completedAt: true
          }
        }),
        tx.userLessonProgress.count({
          where: {
            userId,
            lesson: {
              isActive: true
            }
          }
        }),
        tx.user.findUnique({
          where: {
            id: userId
          },
          select: {
            xp: true,
            level: true
          }
        })
      ]);

      if (!user) {
        throw new LessonCompletionError("LESSON_LOCKED", "Lesson is not available.", 403);
      }

      if (existingProgress?.status === LessonStatus.COMPLETED) {
        return {
          ok: true,
          lesson: toLessonSummary(lesson, LessonStatus.COMPLETED, existingProgress.completedAt),
          xpAwarded: 0,
          user,
          nextLesson: null
        };
      }

      if (existingProgress?.status === LessonStatus.LOCKED) {
        throw new LessonCompletionError("LESSON_LOCKED", "Lesson is locked.", 403);
      }

      const now = new Date();
      let didComplete = false;
      let completedAt: Date | null = existingProgress?.completedAt ?? null;

      if (existingProgress?.status === LessonStatus.UNLOCKED) {
        const completion = await tx.userLessonProgress.updateMany({
          where: {
            id: existingProgress.id,
            status: LessonStatus.UNLOCKED
          },
          data: {
            status: LessonStatus.COMPLETED,
            completedAt: now
          }
        });

        didComplete = completion.count === 1;
        completedAt = didComplete ? now : completedAt;
      } else {
        const isFirstLesson = firstActiveLesson?.id === lesson.id;

        if (!isFirstLesson || activeProgressCount > 0) {
          throw new LessonCompletionError("LESSON_LOCKED", "Lesson is locked.", 403);
        }

        const completion = await tx.userLessonProgress.createMany({
          data: {
            userId,
            lessonId: lesson.id,
            status: LessonStatus.COMPLETED,
            completedAt: now
          },
          skipDuplicates: true
        });

        didComplete = completion.count === 1;
        completedAt = didComplete ? now : completedAt;
      }

      if (!didComplete) {
        const currentProgress = await tx.userLessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId: lesson.id
            }
          },
          select: {
            status: true,
            completedAt: true
          }
        });

        if (currentProgress?.status === LessonStatus.COMPLETED) {
          const currentUser = await tx.user.findUnique({
            where: {
              id: userId
            },
            select: {
              xp: true,
              level: true
            }
          });

          return {
            ok: true,
            lesson: toLessonSummary(lesson, LessonStatus.COMPLETED, currentProgress.completedAt),
            xpAwarded: 0,
            user: currentUser ?? user,
            nextLesson: null
          };
        }

        throw new LessonCompletionError("LESSON_LOCKED", "Lesson is locked.", 403);
      }

      const rewardedUser = await tx.user.update({
        where: {
          id: userId
        },
        data: {
          xp: {
            increment: lesson.xpReward
          }
        },
        select: {
          xp: true,
          level: true
        }
      });

      const nextLevel = getLevelForXp(rewardedUser.xp);
      const updatedUser =
        rewardedUser.level === nextLevel
          ? rewardedUser
          : await tx.user.update({
              where: {
                id: userId
              },
              data: {
                level: nextLevel
              },
              select: {
                xp: true,
                level: true
              }
            });

      const nextLesson = await tx.lesson.findFirst({
        where: {
          isActive: true,
          order: {
            gt: lesson.order
          }
        },
        orderBy: {
          order: "asc"
        },
        select: {
          id: true,
          slug: true,
          title: true,
          order: true,
          xpReward: true
        }
      });

      let nextLessonSummary: LessonSummary | null = null;

      if (nextLesson) {
        await tx.userLessonProgress.createMany({
          data: {
            userId,
            lessonId: nextLesson.id,
            status: LessonStatus.UNLOCKED
          },
          skipDuplicates: true
        });

        await tx.userLessonProgress.updateMany({
          where: {
            userId,
            lessonId: nextLesson.id,
            status: LessonStatus.LOCKED
          },
          data: {
            status: LessonStatus.UNLOCKED,
            completedAt: null
          }
        });

        nextLessonSummary = toLessonSummary(nextLesson, LessonStatus.UNLOCKED, null);
      }

      return {
        ok: true,
        lesson: toLessonSummary(lesson, LessonStatus.COMPLETED, completedAt),
        xpAwarded: lesson.xpReward,
        user: updatedUser,
        nextLesson: nextLessonSummary
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  );
}

export async function completeStudentLesson(userId: string, slug: string): Promise<CompletionResult> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await runCompletionTransaction(userId, slug);
    } catch (error) {
      if (!isRetryableTransactionError(error) || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw new LessonCompletionError("LESSON_LOCKED", "Lesson is not available.", 403);
}

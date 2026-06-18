-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('LOCKED', 'UNLOCKED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "description" TEXT,
ADD COLUMN "xpReward" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "courseId" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- DropIndex
DROP INDEX "Lesson_courseId_slug_key";

-- CreateTable
CREATE TABLE "UserLessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'LOCKED',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_order_idx" ON "Lesson"("order");

-- CreateIndex
CREATE INDEX "Lesson_isActive_idx" ON "Lesson"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserLessonProgress_userId_lessonId_key" ON "UserLessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "UserLessonProgress_userId_idx" ON "UserLessonProgress"("userId");

-- CreateIndex
CREATE INDEX "UserLessonProgress_lessonId_idx" ON "UserLessonProgress"("lessonId");

-- CreateIndex
CREATE INDEX "UserLessonProgress_status_idx" ON "UserLessonProgress"("status");

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

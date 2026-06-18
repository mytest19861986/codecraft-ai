-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT', 'PARENT');

-- CreateEnum
CREATE TYPE "LeadSkillLevel" AS ENUM ('ABSOLUTE_BEGINNER', 'BASIC', 'PREVIOUS_CLASS');

-- CreateEnum
CREATE TYPE "LeadAgeRange" AS ENUM ('AGE_12_14', 'AGE_15_17', 'AGE_18_20');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'REGISTERED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BootcampLead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "ageRange" "LeadAgeRange" NOT NULL,
    "skillLevel" "LeadSkillLevel" NOT NULL,
    "parentPhone" TEXT,
    "city" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BootcampLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "videoUrl" TEXT,
    "order" INTEGER NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BootcampLead_phone_key" ON "BootcampLead"("phone");

-- CreateIndex
CREATE INDEX "BootcampLead_status_idx" ON "BootcampLead"("status");

-- CreateIndex
CREATE INDEX "BootcampLead_createdAt_idx" ON "BootcampLead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_level_idx" ON "Course"("level");

-- CreateIndex
CREATE INDEX "Lesson_courseId_idx" ON "Lesson"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_courseId_slug_key" ON "Lesson"("courseId", "slug");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorId_idx" ON "AdminAuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entity_idx" ON "AdminAuditLog"("entity");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

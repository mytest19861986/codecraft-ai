import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LessonDetailPanel } from "@/components/student/lesson-detail-panel";
import { LessonStatus } from "@/generated/prisma/enums";
import { getAuthenticatedStudent } from "@/lib/security/student-auth";
import { getStudentLessonDetail } from "@/lib/student/lessons";

type LessonDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const metadata = {
  title: "نمایش درس | CodeCraft AI",
  robots: { index: false, follow: false }
};

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect("/login");
  }

  const { slug } = await params;
  const lesson = await getStudentLessonDetail(student.id, slug);

  if (!lesson) {
    notFound();
  }

  if (lesson.status === LessonStatus.LOCKED) {
    return (
      <section className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-4xl items-center px-5 py-10 sm:px-7 sm:py-14 lg:px-5">
        <div className="glass-panel neon-ring w-full rounded-lg p-5 text-center sm:p-8">
          <p className="mx-auto w-fit rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-[#a9aec7]">
            مرحله {lesson.order}
          </p>
          <h1 className="mt-5 text-2xl font-black leading-10 text-white sm:text-4xl">{lesson.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#d9dcf0]">
            این درس هنوز برای تو باز نشده است. مرحله‌های قبلی را کامل کن تا محتوای این درس فعال شود.
          </p>
          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3">
              <p className="text-xl font-black text-white">{lesson.xpReward}</p>
              <p className="mt-1 text-xs font-black text-[#39ff88]">XP</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-xl font-black text-white">قفل</p>
              <p className="mt-1 text-xs font-black text-[#a9aec7]">وضعیت</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-md border border-[#39ff88]/40 bg-[#39ff88]/15 px-5 py-3 text-sm font-black text-[#d7ffe6] transition hover:border-[#39ff88] hover:bg-[#39ff88]/25"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-5xl items-center px-5 py-10 sm:px-7 sm:py-14 lg:px-5">
      <LessonDetailPanel
        lesson={{
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          content: lesson.content,
          contentPreview: lesson.contentPreview,
          order: lesson.order,
          xpReward: lesson.xpReward,
          status: lesson.status,
          completedAt: lesson.completedAt ? lesson.completedAt.toISOString() : null
        }}
      />
    </section>
  );
}

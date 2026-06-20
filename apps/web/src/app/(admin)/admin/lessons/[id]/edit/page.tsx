import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { LessonForm } from "@/app/(admin)/admin/lessons/_components/lesson-form";
import { updateLessonAction } from "@/app/(admin)/admin/lessons/actions";
import { getAdminLesson } from "@/lib/admin/lessons";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

type EditLessonPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const savedMessages = {
  created: "درس با موفقیت ساخته شد.",
  updated: "درس با موفقیت به‌روزرسانی شد."
} as const;

export const metadata = {
  title: "ویرایش درس",
  robots: { index: false, follow: false }
};

export default async function EditLessonPage({ params, searchParams }: EditLessonPageProps) {
  const adminSession = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!verifyAdminSessionCookie(adminSession)) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const lesson = await getAdminLesson(id);

  if (!lesson) {
    notFound();
  }

  const updateAction = updateLessonAction.bind(null, id);
  const query = await searchParams;
  const savedMessage =
    query?.saved === "created" || query?.saved === "updated" ? savedMessages[query.saved] : null;

  return (
    <section dir="rtl" className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div>
        <p className="text-sm font-bold text-[#39ff88]">مدیریت درس‌ها</p>
        <h1 className="mt-2 text-3xl font-black text-white">ویرایش درس</h1>
        <p dir="ltr" className="mt-3 max-w-2xl text-left font-mono text-sm text-[#a9aec7]">
          {lesson.slug}
        </p>
      </div>
      <LessonForm
        action={updateAction}
        lesson={lesson}
        errorMessage={query?.error ?? null}
        savedMessage={savedMessage}
        submitLabel="ذخیره تغییرات"
      />
    </section>
  );
}

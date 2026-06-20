import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LessonForm } from "@/app/(admin)/admin/lessons/_components/lesson-form";
import { createLessonAction } from "@/app/(admin)/admin/lessons/actions";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

type NewLessonPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export const metadata = {
  title: "درس جدید",
  robots: { index: false, follow: false }
};

export default async function NewLessonPage({ searchParams }: NewLessonPageProps) {
  const adminSession = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!verifyAdminSessionCookie(adminSession)) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  return (
    <section dir="rtl" className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div>
        <p className="text-sm font-bold text-[#39ff88]">مدیریت درس‌ها</p>
        <h1 className="mt-2 text-3xl font-black text-white">ساخت درس جدید</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a9aec7]">
          برای دمو، درس را کوتاه و مرحله‌ای بنویسید: یک هدف روشن، یک تمرین کوچک، و پاداش XP قابل توضیح. درس فعال در مسیر یادگیری دانش‌آموزها نمایش داده می‌شود.
        </p>
      </div>
      <LessonForm action={createLessonAction} errorMessage={params?.error ?? null} submitLabel="ساخت درس" />
    </section>
  );
}

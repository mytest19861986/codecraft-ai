import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteLessonButton } from "@/app/(admin)/admin/lessons/_components/delete-lesson-button";
import { deleteLessonAction } from "@/app/(admin)/admin/lessons/actions";
import { listAdminLessons } from "@/lib/admin/lessons";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";

const ui = {
  pageTitle: "مدیریت درس‌ها",
  heading: "مدیریت درس‌ها",
  banner: "پنل آماده دمو؛ ساخت، ویرایش، فعال‌سازی و مرتب‌سازی درس‌ها",
  countLabel: "تعداد درس‌ها",
  emptyTitle: "هنوز درسی ثبت نشده است.",
  emptyDescription: "برای دمو، یک درس کوتاه با عنوان روشن، توضیح ساده و پاداش XP بسازید.",
  columns: {
    order: "ترتیب",
    title: "عنوان",
    slug: "اسلاگ",
    xpReward: "XP",
    active: "وضعیت",
    content: "محتوا",
    createdAt: "ساخته‌شده",
    updatedAt: "به‌روزرسانی",
    actions: "عملیات"
  }
} as const;

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short"
});

const savedMessages = {
  deleted: "درس با موفقیت حذف شد."
} as const;

type AdminLessonsPageProps = {
  searchParams?: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export const metadata = {
  title: ui.pageTitle,
  robots: { index: false, follow: false }
};

export default async function AdminLessonsPage({ searchParams }: AdminLessonsPageProps) {
  const adminSession = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!verifyAdminSessionCookie(adminSession)) {
    redirect("/admin/login");
  }

  const lessons = await listAdminLessons();
  const query = await searchParams;
  const savedMessage = query?.saved === "deleted" ? savedMessages.deleted : null;

  return (
    <section dir="rtl" className="mx-auto w-full max-w-7xl px-5 py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#39ff88]">مدیریت درس‌ها</p>
          <h1 className="mt-2 text-3xl font-black text-white">{ui.heading}</h1>
          <p className="mt-3 text-sm font-bold text-[#d9dcf0]">
            {ui.countLabel}: <span className="text-[#39ff88]">{lessons.length.toLocaleString("fa-IR")}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <span className="w-fit rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-bold text-[#dfffea]">
            {ui.banner}
          </span>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/lessons/new"
              className="rounded-md bg-[#9b5cff] px-4 py-2 text-sm font-black text-white hover:bg-[#8750e0]"
            >
              درس جدید
            </Link>
            <form action="/admin/session" method="post">
              <button
                className="rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white hover:border-[#ff6b9d] hover:text-[#ffd6e5]"
                type="submit"
              >
                خروج
              </button>
            </form>
          </div>
        </div>
      </div>

      {query?.error ? (
        <p className="mt-6 rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-4 py-3 text-sm font-bold leading-7 text-[#ffd6e5]">
          {query.error}
        </p>
      ) : null}

      {savedMessage ? (
        <p className="mt-6 rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-4 py-3 text-sm font-bold leading-7 text-[#dfffea]">
          {savedMessage}
        </p>
      ) : null}

      <div className="glass-panel neon-ring mt-8 overflow-hidden rounded-lg">
        {lessons.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-lg font-black text-white">{ui.emptyTitle}</p>
            <p className="mt-2 text-sm text-[#a9aec7]">{ui.emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[0.55fr_1.35fr_1.15fr_0.5fr_0.75fr_0.7fr_0.95fr_0.95fr_1fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-bold text-[#a9aec7]">
                <span>{ui.columns.order}</span>
                <span>{ui.columns.title}</span>
                <span>{ui.columns.slug}</span>
                <span>{ui.columns.xpReward}</span>
                <span>{ui.columns.active}</span>
                <span>{ui.columns.content}</span>
                <span>{ui.columns.createdAt}</span>
                <span>{ui.columns.updatedAt}</span>
                <span>{ui.columns.actions}</span>
              </div>

              {lessons.map((lesson) => {
                const hasContent = Boolean(lesson.content?.trim());

                return (
                  <article
                    key={lesson.id}
                    className="grid grid-cols-[0.55fr_1.35fr_1.15fr_0.5fr_0.75fr_0.7fr_0.95fr_0.95fr_1fr] gap-3 border-b border-white/10 px-4 py-4 text-sm text-white last:border-b-0"
                  >
                    <span className="font-black text-[#39ff88]">{lesson.order.toLocaleString("fa-IR")}</span>
                    <span className="font-bold">{lesson.title}</span>
                    <span dir="ltr" className="truncate text-left font-mono text-[#dfe2f3]">
                      {lesson.slug}
                    </span>
                    <span className="font-bold text-[#dfe2f3]">{lesson.xpReward.toLocaleString("fa-IR")}</span>
                    <span
                      className={`w-fit rounded-md border px-2 py-1 text-xs font-black ${
                        lesson.isActive
                          ? "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#dfffea]"
                          : "border-[#ffd166]/30 bg-[#ffd166]/10 text-[#fff1c2]"
                      }`}
                    >
                      {lesson.isActive ? "فعال - قابل مشاهده" : "غیرفعال - پنهان"}
                    </span>
                    <span
                      className={`w-fit rounded-md border px-2 py-1 text-xs font-black ${
                        hasContent
                          ? "border-[#66d9ff]/30 bg-[#66d9ff]/10 text-[#d5f4ff]"
                          : "border-white/10 bg-white/5 text-[#a9aec7]"
                      }`}
                    >
                      {hasContent ? "دارد" : "ندارد"}
                    </span>
                    <time dir="ltr" className="text-left text-[#a9aec7]" dateTime={lesson.createdAt.toISOString()}>
                      {dateFormatter.format(lesson.createdAt)}
                    </time>
                    <time dir="ltr" className="text-left text-[#a9aec7]" dateTime={lesson.updatedAt.toISOString()}>
                      {dateFormatter.format(lesson.updatedAt)}
                    </time>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/lessons/${encodeURIComponent(lesson.id)}/edit`}
                        className="w-fit rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#dfffea] hover:border-[#39ff88]"
                      >
                        ویرایش
                      </Link>
                      <DeleteLessonButton
                        action={deleteLessonAction.bind(null, lesson.id)}
                        lessonTitle={lesson.title}
                        lessonOrder={lesson.order}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

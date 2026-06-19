"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { LessonStatus } from "@/generated/prisma/enums";

type StudentSummary = {
  name: string;
  phone: string;
  xp: number;
  level: number;
};

type LessonItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  contentPreview: string | null;
  hasContent: boolean;
  order: number;
  xpReward: number;
  status: LessonStatus;
  completedAt: string | null;
};

type CompletionResponse = {
  ok: true;
  lesson: {
    id: string;
    slug: string;
    title: string;
    order: number;
    xpReward: number;
    status: LessonStatus;
    completedAt: string | null;
  };
  xpAwarded: number;
  user: {
    xp: number;
    level: number;
  };
  nextLesson: {
    id: string;
    slug: string;
    title: string;
    order: number;
    xpReward: number;
    status: LessonStatus;
    completedAt: string | null;
  } | null;
};

type StudentDashboardPanelProps = {
  student: StudentSummary;
  lessons: LessonItem[];
  logoutButton: ReactNode;
};

const statusLabels: Record<LessonStatus, string> = {
  [LessonStatus.LOCKED]: "قفل",
  [LessonStatus.UNLOCKED]: "باز",
  [LessonStatus.COMPLETED]: "تکمیل‌شده"
};

const statusStyles: Record<LessonStatus, string> = {
  [LessonStatus.LOCKED]: "border-white/10 bg-black/35 text-[#a9aec7]",
  [LessonStatus.UNLOCKED]: "border-[#ff3df2]/40 bg-[#ff3df2]/10 text-[#ff8cf8]",
  [LessonStatus.COMPLETED]: "border-[#39ff88]/35 bg-[#39ff88]/10 text-[#39ff88]"
};

const cardStyles: Record<LessonStatus, string> = {
  [LessonStatus.LOCKED]: "border-white/10 bg-white/[0.025] opacity-75",
  [LessonStatus.UNLOCKED]: "border-[#ff3df2]/35 bg-[#ff3df2]/[0.07] shadow-[0_0_28px_rgba(255,61,242,0.12)]",
  [LessonStatus.COMPLETED]: "border-[#39ff88]/35 bg-[#39ff88]/[0.06]"
};

function formatPersianDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function StudentDashboardPanel({ student, lessons, logoutButton }: StudentDashboardPanelProps) {
  const [currentStudent, setCurrentStudent] = useState(student);
  const [lessonPath, setLessonPath] = useState(lessons);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const xpPerLevel = 100;
  const xpIntoLevel = currentStudent.xp % xpPerLevel;
  const levelProgressPercent = Math.min(100, Math.max(0, xpIntoLevel));
  const totalLessons = lessonPath.length;
  const completedLessons = lessonPath.filter((lesson) => lesson.status === LessonStatus.COMPLETED).length;
  const lessonProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const nextLesson = lessonPath.find((lesson) => lesson.status === LessonStatus.UNLOCKED) ?? null;
  const lessonsBySlug = useMemo(() => new Map(lessonPath.map((lesson) => [lesson.slug, lesson])), [lessonPath]);
  const isCompleting = (slug: string) => isPending && pendingSlug === slug;

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => setMessage(null), 4500);

    return () => window.clearTimeout(timeout);
  }, [message]);

  function applyCompletion(data: CompletionResponse) {
    setCurrentStudent((previous) => ({
      ...previous,
      xp: data.user.xp,
      level: data.user.level
    }));
    setLessonPath((previous) =>
      previous.map((lesson) => {
        if (lesson.id === data.lesson.id) {
          return {
            ...lesson,
            status: data.lesson.status,
            completedAt: data.lesson.completedAt
          };
        }

        if (data.nextLesson && lesson.id === data.nextLesson.id && lesson.status !== LessonStatus.COMPLETED) {
          return {
            ...lesson,
            status: data.nextLesson.status,
            completedAt: data.nextLesson.completedAt
          };
        }

        return lesson;
      })
    );
    setMessage(data.xpAwarded > 0 ? "آفرین! درس تکمیل شد و XP گرفتی." : "این درس قبلا تکمیل شده بود.");
  }

  function completeLesson(slug: string) {
    const lesson = lessonsBySlug.get(slug);

    if (!lesson || lesson.status !== LessonStatus.UNLOCKED) {
      return;
    }

    setPendingSlug(slug);
    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/v1/student/lessons/${encodeURIComponent(slug)}/complete`, {
          method: "POST",
          headers: {
            Accept: "application/json"
          }
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.ok) {
          setMessage("تکمیل درس انجام نشد. کمی بعد دوباره تلاش کن.");
          return;
        }

        applyCompletion(data as CompletionResponse);
      } catch {
        setMessage("ارتباط برقرار نشد. کمی بعد دوباره تلاش کن.");
      } finally {
        setPendingSlug(null);
      }
    });
  }

  return (
    <div className="glass-panel neon-ring w-full rounded-lg p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
            Student Dashboard
          </p>
          <h1 className="mt-5 text-2xl font-black leading-10 text-white sm:text-3xl">
            سلام {currentStudent.name}، آماده‌ای مسیر کدنویسی‌ات را جلو ببری؟
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-[#a9aec7]">
            اینجا نقشه یادگیری توست: مرحله‌ها را باز کن، XP بگیر و هر بار یک قدم حرفه‌ای‌تر شو.
          </p>
        </div>
        {logoutButton}
      </div>

      {message ? (
        <div className="mt-5 rounded-lg border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-sm font-black leading-7 text-[#d7ffe6]">
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black text-[#39ff88]">خلاصه پیشرفت</p>
              <h2 className="mt-3 text-xl font-black leading-9 text-white">مسیر یادگیری تو</h2>
            </div>
            <div className="rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-center">
              <p className="text-2xl font-black text-white">{lessonProgressPercent}%</p>
              <p className="mt-1 text-xs font-black text-[#39ff88]">پیشرفت دوره</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-[#a9aec7]">درس‌های تکمیل‌شده</p>
              <p className="mt-2 text-2xl font-black text-white">
                {completedLessons}/{totalLessons}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-[#a9aec7]">Level</p>
              <p className="mt-2 text-2xl font-black text-white">{currentStudent.level}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-[#a9aec7]">XP فعلی</p>
              <p className="mt-2 text-2xl font-black text-white">{currentStudent.xp}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-[#a9aec7]">پروفایل</p>
              <p className="mt-2 truncate text-sm font-black text-white">{currentStudent.name}</p>
              <p className="mt-1 text-xs font-bold text-[#a9aec7]" dir="ltr">
                {currentStudent.phone}
              </p>
            </div>
          </div>

          <div
            className="mt-5 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40"
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={lessonProgressPercent}
          >
            <div
              className="h-full rounded-full bg-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,0.55)]"
              style={{ width: `${lessonProgressPercent}%` }}
            />
          </div>
        </section>

        <section className="rounded-lg border border-[#ff3df2]/25 bg-[#ff3df2]/[0.055] p-5">
          <p className="text-xs font-black text-[#ff8cf8]">مرحله بعدی تو</p>
          {nextLesson ? (
            <>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#d9dcf0]">مرحله {nextLesson.order}</p>
                  <h2 className="mt-2 text-xl font-black leading-9 text-white">{nextLesson.title}</h2>
                </div>
                <span className="w-fit rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
                  ادامه بده و XP بگیر
                </span>
              </div>
              {nextLesson.description ? (
                <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">{nextLesson.description}</p>
              ) : (
                <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">این مرحله آماده شروع است.</p>
              )}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-black text-[#39ff88]">پاداش: {nextLesson.xpReward} XP</p>
                <button
                  type="button"
                  onClick={() => completeLesson(nextLesson.slug)}
                  disabled={isCompleting(nextLesson.slug)}
                  className="rounded-md border border-[#39ff88]/40 bg-[#39ff88]/15 px-5 py-3 text-sm font-black text-[#d7ffe6] transition hover:border-[#39ff88] hover:bg-[#39ff88]/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCompleting(nextLesson.slug) ? "در حال تکمیل..." : "تکمیل درس"}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 p-4">
              <h2 className="text-xl font-black leading-9 text-white">فعلا همه مرحله‌ها را کامل کردی</h2>
              <p className="mt-2 text-sm leading-8 text-[#d9dcf0]">وقتی درس جدید فعال شود، همین‌جا نمایش داده می‌شود.</p>
            </div>
          )}

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-xs font-black text-[#39ff88]">XP Progress</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-sm font-bold text-[#a9aec7]">Level {currentStudent.level}</p>
              <p className="text-sm font-black text-[#d9dcf0]">
                {xpIntoLevel}/{xpPerLevel}
              </p>
            </div>
            <div
              className="mt-3 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40"
              role="progressbar"
              aria-label="XP progress"
              aria-valuemin={0}
              aria-valuemax={xpPerLevel}
              aria-valuenow={xpIntoLevel}
            >
              <div
                className="h-full rounded-full bg-[#ff3df2] shadow-[0_0_18px_rgba(255,61,242,0.45)]"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 border-t border-white/10 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#39ff88]">مسیر یادگیری</p>
            <h2 className="mt-2 text-xl font-black leading-9 text-white sm:text-2xl">مرحله‌های کدنویسی تو</h2>
          </div>
          <p className="text-sm font-bold text-[#a9aec7]">
            {completedLessons} از {totalLessons} درس تکمیل شده
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {lessonPath.map((lesson) => {
            const isLocked = lesson.status === LessonStatus.LOCKED;
            const isCompleted = lesson.status === LessonStatus.COMPLETED;
            const completedDate = formatPersianDate(lesson.completedAt);

            return (
              <article key={lesson.id} className={`rounded-lg border p-5 ${cardStyles[lesson.status]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-[#a9aec7]">مرحله {lesson.order}</p>
                    <p className="mt-2 text-sm font-black text-[#39ff88]">{lesson.xpReward} XP</p>
                  </div>
                  <span className={`rounded-md border px-3 py-1 text-xs font-black ${statusStyles[lesson.status]}`}>
                    {statusLabels[lesson.status]}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-black leading-8 text-white">{lesson.title}</h3>
                {lesson.description ? <p className="mt-3 text-sm leading-7 text-[#a9aec7]">{lesson.description}</p> : null}

                <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-black text-[#ff8cf8]">پیش‌نمایش محتوا</p>
                  {lesson.contentPreview ? (
                    <p className="mt-2 text-sm leading-7 text-[#d9dcf0]">{lesson.contentPreview}</p>
                  ) : (
                    <p className="mt-2 text-sm leading-7 text-[#a9aec7]">محتوای کامل این درس به‌زودی اضافه می‌شود.</p>
                  )}
                  {isLocked ? (
                    <button
                    type="button"
                    disabled
                    className="mt-4 w-full cursor-not-allowed rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-[#a9aec7]"
                  >
                    مشاهده محتوای درس
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/lessons/${encodeURIComponent(lesson.slug)}`}
                      className="mt-4 flex w-full items-center justify-center rounded-md border border-[#ff3df2]/35 bg-[#ff3df2]/10 px-4 py-3 text-sm font-black text-[#ffd7fd] transition hover:border-[#ff3df2] hover:bg-[#ff3df2]/20"
                    >
                      مشاهده درس
                    </Link>
                  )}
                </div>

                {completedDate ? (
                  <p className="mt-4 text-xs font-bold leading-6 text-[#d9dcf0]">تکمیل شده در {completedDate}</p>
                ) : null}

                {lesson.status === LessonStatus.UNLOCKED ? (
                  <button
                    type="button"
                    onClick={() => completeLesson(lesson.slug)}
                    disabled={isCompleting(lesson.slug)}
                    className="mt-5 w-full rounded-md border border-[#39ff88]/40 bg-[#39ff88]/15 px-4 py-3 text-sm font-black text-[#d7ffe6] transition hover:border-[#39ff88] hover:bg-[#39ff88]/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCompleting(lesson.slug) ? "در حال تکمیل..." : "تکمیل درس"}
                  </button>
                ) : isCompleted ? (
                  <p className="mt-5 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-center text-sm font-black text-[#39ff88]">
                    تکمیل‌شده
                  </p>
                ) : (
                  <p className="mt-5 rounded-md border border-white/10 bg-black/25 px-4 py-3 text-center text-sm font-black text-[#a9aec7]">
                    قفل
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

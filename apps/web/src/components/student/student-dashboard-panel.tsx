"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
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

export function StudentDashboardPanel({ student, lessons, logoutButton }: StudentDashboardPanelProps) {
  const [currentStudent, setCurrentStudent] = useState(student);
  const [lessonPath, setLessonPath] = useState(lessons);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const xpPerLevel = 100;
  const xpIntoLevel = currentStudent.xp % xpPerLevel;
  const progressPercent = Math.min(100, Math.max(0, xpIntoLevel));
  const lessonsBySlug = useMemo(() => new Map(lessonPath.map((lesson) => [lesson.slug, lesson])), [lessonPath]);
  const isCompleting = (slug: string) => isPending && pendingSlug === slug;

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
    setMessage(data.xpAwarded > 0 ? "آفرین! درس تکمیل شد و امتیاز گرفتی." : "این درس قبلاً تکمیل شده بود.");
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
            سلام {currentStudent.name}، به داشبورد CodeCraft خوش آمدی
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-8 text-[#a9aec7]">
            اینجا فضای امن یادگیری توست. امتیاز تجربه‌ات با فعالیت‌های ساده رشد می‌کند و مسیر پیشرفتت را نشان می‌دهد.
          </p>
        </div>
        {logoutButton}
      </div>

      {message ? (
        <div className="mt-5 rounded-lg border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-sm font-black leading-7 text-[#d7ffe6]">
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black text-[#39ff88]">پروفایل دانش‌آموز</p>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-bold text-[#a9aec7]">نام</dt>
              <dd className="mt-1 font-black text-white">{currentStudent.name}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#a9aec7]">شماره موبایل</dt>
              <dd className="mt-1 font-black text-white" dir="ltr">
                {currentStudent.phone}
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[#a9aec7]">Level</dt>
              <dd className="mt-1 font-black text-white">{currentStudent.level}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#a9aec7]">XP</dt>
              <dd className="mt-1 font-black text-white">{currentStudent.xp}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-[#39ff88]/20 bg-[#39ff88]/[0.06] p-5">
          <p className="text-xs font-black text-[#39ff88]">XP Progress</p>
          <h2 className="mt-4 text-xl font-black leading-9 text-white sm:text-2xl">Level {currentStudent.level}</h2>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#a9aec7]">Total XP</p>
              <p className="mt-1 text-3xl font-black text-white">{currentStudent.xp}</p>
            </div>
            <p className="text-sm font-black text-[#d9dcf0]">
              {xpIntoLevel}/{xpPerLevel}
            </p>
          </div>
          <div
            className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40"
            role="progressbar"
            aria-label="XP progress"
            aria-valuemin={0}
            aria-valuemax={xpPerLevel}
            aria-valuenow={xpIntoLevel}
          >
            <div
              className="h-full rounded-full bg-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,0.55)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#39ff88]">مسیر یادگیری</p>
            <h2 className="mt-2 text-xl font-black leading-9 text-white sm:text-2xl">مرحله‌های کدنویسی تو</h2>
          </div>
          <p className="text-sm font-bold text-[#a9aec7]">{lessonPath.length} درس فعال</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {lessonPath.map((lesson) => {
            const isLocked = lesson.status === LessonStatus.LOCKED;
            const isCompleted = lesson.status === LessonStatus.COMPLETED;

            return (
              <article key={lesson.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-black text-[#a9aec7]">مرحله {lesson.order}</p>
                  <span
                    className={
                      isCompleted
                        ? "rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-1 text-xs font-black text-[#39ff88]"
                        : isLocked
                          ? "rounded-md border border-white/10 bg-black/30 px-3 py-1 text-xs font-black text-[#a9aec7]"
                          : "rounded-md border border-[#ff3df2]/30 bg-[#ff3df2]/10 px-3 py-1 text-xs font-black text-[#ff8cf8]"
                    }
                  >
                    {statusLabels[lesson.status]}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-black leading-8 text-white">{lesson.title}</h3>
                {lesson.description ? <p className="mt-3 text-sm leading-7 text-[#a9aec7]">{lesson.description}</p> : null}
                <p className="mt-4 text-sm font-black text-[#39ff88]">{lesson.xpReward} XP</p>
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
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

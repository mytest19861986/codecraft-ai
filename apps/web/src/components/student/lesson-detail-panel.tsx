"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { LessonStatus } from "@/generated/prisma/enums";

type LessonDetail = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  contentPreview: string | null;
  order: number;
  xpReward: number;
  status: AccessibleLessonStatus;
  completedAt: string | null;
};

type CompletionResponse = {
  ok: true;
  lesson: {
    id: string;
    status: LessonStatus;
    completedAt: string | null;
  };
  xpAwarded: number;
};

type LessonDetailPanelProps = {
  lesson: LessonDetail;
};

type AccessibleLessonStatus = typeof LessonStatus.UNLOCKED | typeof LessonStatus.COMPLETED;

const statusLabels: Record<AccessibleLessonStatus, string> = {
  [LessonStatus.UNLOCKED]: "باز",
  [LessonStatus.COMPLETED]: "تکمیل‌شده"
};

const statusStyles: Record<AccessibleLessonStatus, string> = {
  [LessonStatus.UNLOCKED]: "border-[#ff3df2]/40 bg-[#ff3df2]/10 text-[#ff8cf8]",
  [LessonStatus.COMPLETED]: "border-[#39ff88]/35 bg-[#39ff88]/10 text-[#39ff88]"
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

export function LessonDetailPanel({ lesson }: LessonDetailPanelProps) {
  const [currentLesson, setCurrentLesson] = useState(lesson);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const completedDate = formatPersianDate(currentLesson.completedAt);
  const displayContent =
    currentLesson.content?.trim() ||
    currentLesson.contentPreview?.trim() ||
    "محتوای کامل این درس به‌زودی اضافه می‌شود.";

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => setMessage(null), 5000);

    return () => window.clearTimeout(timeout);
  }, [message]);

  function completeLesson() {
    if (currentLesson.status !== LessonStatus.UNLOCKED) {
      return;
    }

    setMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/v1/student/lessons/${encodeURIComponent(currentLesson.slug)}/complete`, {
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

        const completion = data as CompletionResponse;

        setCurrentLesson((previous) => ({
          ...previous,
          status: LessonStatus.COMPLETED,
          completedAt: completion.lesson.completedAt
        }));
        setMessage(
          completion.xpAwarded > 0
            ? "آفرین! درس تکمیل شد و XP این مرحله ثبت شد."
            : "این درس قبلا تکمیل شده بود و XP دوباره اضافه نشد."
        );
      } catch {
        setMessage("ارتباط برقرار نشد. کمی بعد دوباره تلاش کن.");
      }
    });
  }

  return (
    <div className="glass-panel neon-ring w-full rounded-lg p-5 sm:p-7 lg:p-8">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex w-fit rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs font-black text-[#a9aec7] transition hover:border-[#39ff88]/40 hover:text-[#d7ffe6]"
          >
            بازگشت به داشبورد
          </Link>
          <p className="mt-5 text-xs font-black text-[#39ff88]">مرحله {currentLesson.order}</p>
          <h1 className="mt-3 text-2xl font-black leading-10 text-white sm:text-4xl">{currentLesson.title}</h1>
          {currentLesson.description ? (
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[#d9dcf0]">{currentLesson.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-56">
          <div className="rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-center">
            <p className="text-xl font-black text-white">{currentLesson.xpReward}</p>
            <p className="mt-1 text-xs font-black text-[#39ff88]">XP</p>
          </div>
          <div className={`rounded-md border px-4 py-3 text-center ${statusStyles[currentLesson.status]}`}>
            <p className="text-sm font-black">{statusLabels[currentLesson.status]}</p>
            <p className="mt-1 text-xs font-bold opacity-80">وضعیت</p>
          </div>
        </div>
      </div>

      {message ? (
        <div className="mt-5 rounded-lg border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-sm font-black leading-7 text-[#d7ffe6]">
          {message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black text-[#ff8cf8]">محتوای درس</p>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[#d9dcf0]">{displayContent}</div>
        </article>

        <aside className="space-y-5">
          <div className="aspect-video rounded-lg border border-white/10 bg-black/35 p-4 shadow-[inset_0_0_28px_rgba(155,92,255,0.12)]">
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-[#ff3df2]/25 bg-[#ff3df2]/[0.04] px-4 text-center text-sm font-black leading-7 text-[#ffb8fb]">
              ویدیوی این مرحله به‌زودی اضافه می‌شود
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/25 p-5">
            <p className="text-xs font-black text-[#39ff88]">جزئیات مرحله</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#a9aec7]">ترتیب</dt>
                <dd className="font-black text-white">مرحله {currentLesson.order}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#a9aec7]">پاداش</dt>
                <dd className="font-black text-white">{currentLesson.xpReward} XP</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#a9aec7]">وضعیت</dt>
                <dd className="font-black text-white">{statusLabels[currentLesson.status]}</dd>
              </div>
              {completedDate ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#a9aec7]">تاریخ تکمیل</dt>
                  <dd className="font-black text-white">{completedDate}</dd>
                </div>
              ) : null}
            </dl>

            {currentLesson.status === LessonStatus.UNLOCKED ? (
              <button
                type="button"
                onClick={completeLesson}
                disabled={isPending}
                className="mt-5 w-full rounded-md border border-[#39ff88]/40 bg-[#39ff88]/15 px-4 py-3 text-sm font-black text-[#d7ffe6] transition hover:border-[#39ff88] hover:bg-[#39ff88]/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "در حال تکمیل..." : "تکمیل درس"}
              </button>
            ) : (
              <div className="mt-5 rounded-md border border-[#39ff88]/25 bg-[#39ff88]/10 px-4 py-3 text-center text-sm font-black text-[#39ff88]">
                این درس تکمیل شده است
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

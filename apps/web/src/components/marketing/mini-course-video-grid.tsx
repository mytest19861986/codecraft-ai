"use client";

import Image from "next/image";
import { useState } from "react";

import { SectionHeading } from "@/components/ui/section-heading";

type MiniCourseVideo = {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  videoUrl: string;
  coverUrl: string;
  description?: string;
};

const videos: MiniCourseVideo[] = [
  {
    id: "session-1",
    title: "جلسه اول: ساخت چت‌باکس نئونی پایتون",
    duration: "۲۴ دقیقه",
    isLocked: false,
    videoUrl: "/videos/codecraft-session-1.mp4",
    coverUrl: "/images/video-cover-session-1.jpg",
    description: "شروع عملی با یک پروژه کوچک، جذاب و قابل نمایش."
  },
  {
    id: "session-2",
    title: "جلسه دوم: منطق پاسخ‌گویی و تمرین XP",
    duration: "به‌زودی",
    isLocked: true,
    videoUrl: "/videos/codecraft-session-2.mp4",
    coverUrl: "/images/video-cover-session-2.jpg",
    description: "بعد از ارسال تمرین جلسه اول در ربات تلگرام باز می‌شود."
  },
  {
    id: "session-3",
    title: "جلسه سوم: آماده‌سازی خروجی نهایی",
    duration: "به‌زودی",
    isLocked: true,
    videoUrl: "/videos/codecraft-session-3.mp4",
    coverUrl: "/images/video-cover-session-3.jpg",
    description: "مرحله نهایی برای تبدیل ایده به یک نمونه قابل ارائه."
  }
];

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-11 drop-shadow-[0_0_14px_rgba(34,197,94,0.75)]"
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="stroke-[#22c55e]" height="22" rx="5" strokeWidth="3" width="30" x="9" y="20" />
      <path className="stroke-purple-300" d="M16 20v-5a8 8 0 0 1 16 0v5" strokeLinecap="round" strokeWidth="3" />
      <path className="stroke-[#22c55e]" d="M24 29v5" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function MiniCourseVideoGrid() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20" dir="rtl">
      <div className="rounded-lg border border-purple-500/25 bg-[#0d0d13]/92 p-5 shadow-[0_0_44px_rgba(168,85,247,0.13)] sm:p-7 lg:p-8">
        <SectionHeading
          eyebrow="Free Mini Course"
          title="مینی‌دوره رایگان کدکرافت"
          subtitle="جلسه اول را همین حالا ببین؛ جلسه‌های بعدی با ارسال تمرین در ربات تلگرام باز می‌شوند."
        />

        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {videos.map((video) => {
            const isPlaying = playingId === video.id;

            return (
              <article
                className={`group overflow-hidden rounded-lg border bg-[#12131d] shadow-[0_18px_70px_rgba(0,0,0,0.28)] transition-all duration-300 ${
                  video.isLocked
                    ? "border-white/10"
                    : "border-[#22c55e]/30 hover:scale-[1.02] hover:border-[#22c55e]/70 hover:shadow-[0_0_32px_rgba(34,197,94,0.2)]"
                }`}
                key={video.id}
              >
                <div className="relative aspect-video overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.26),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.3),transparent_34%),linear-gradient(135deg,#111827,#0d0d13)]">
                  {isPlaying ? (
                    <video
                      autoPlay
                      className="size-full bg-black object-cover"
                      controls
                      poster={video.coverUrl}
                      src={video.videoUrl}
                    />
                  ) : (
                    <>
                      <Image
                        alt={video.title}
                        className="object-cover opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                        fill
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        src={video.coverUrl}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d13] via-[#0d0d13]/25 to-transparent" />
                    </>
                  )}

                  {!video.isLocked && !isPlaying ? (
                    <button
                      aria-label={`پخش ${video.title}`}
                      className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#22c55e]/80 bg-[#22c55e] text-black shadow-[0_0_30px_rgba(34,197,94,0.65)] transition-all duration-300 hover:scale-110 hover:bg-[#39ff88] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d13]"
                      onClick={() => setPlayingId(video.id)}
                      type="button"
                    >
                      <svg aria-hidden="true" className="mr-1 size-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  ) : null}

                  {video.isLocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/58 px-5 text-center backdrop-blur-md">
                      <LockIcon />
                      <p className="text-sm font-black leading-7 text-[#ecfff4]">
                        🔒 قفل - باز شدن با ارسال تمرین در ربات تلگرام
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-md border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-xs font-black text-purple-200">
                      {video.duration}
                    </span>
                    <span className="rounded-md border border-[#22c55e]/35 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-black text-[#86efac]">
                      {video.isLocked ? "Locked" : "Active"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-8 text-white transition-colors duration-300 group-hover:text-[#86efac]">
                    {video.title}
                  </h3>
                  {video.description ? <p className="mt-3 text-sm leading-7 text-[#a9aec7]">{video.description}</p> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import type { AdminLesson } from "@/lib/admin/lessons";

type LessonFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  lesson?: AdminLesson;
  errorMessage?: string | null;
  savedMessage?: string | null;
  submitLabel: string;
};

const inputClass =
  "mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#9b5cff]";

const textAreaClass =
  "mt-2 min-h-32 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#9b5cff]";

export function LessonForm({ action, lesson, errorMessage, savedMessage, submitLabel }: LessonFormProps) {
  return (
    <form action={action} className="glass-panel neon-ring mt-8 rounded-lg p-5 sm:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">عنوان درس</span>
          <input className={inputClass} name="title" required defaultValue={lesson?.title ?? ""} />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">اسلاگ</span>
          <input
            className={`${inputClass} text-left font-mono`}
            dir="ltr"
            name="slug"
            required
            defaultValue={lesson?.slug ?? ""}
            placeholder="javascript-variables"
          />
          <p className="mt-2 text-xs font-semibold text-[#aeb4d8]">مثال برای دمو: coding-adventure-start</p>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">پاداش XP</span>
          <input className={inputClass} name="xpReward" type="number" min="0" max="500" required defaultValue={lesson?.xpReward ?? 20} />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">ترتیب</span>
          <input className={inputClass} name="order" type="number" min="1" required defaultValue={lesson?.order ?? 1} />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-bold text-[#d9dcf0]">توضیح کوتاه</span>
          <textarea
            className={textAreaClass}
            name="description"
            defaultValue={lesson?.description ?? ""}
            placeholder="مثلا: در این مرحله یاد می‌گیری چطور یک مسئله را به چند ماموریت کوچک تبدیل کنی."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-bold text-[#d9dcf0]">محتوا</span>
          <textarea
            className={`${textAreaClass} min-h-56`}
            name="content"
            defaultValue={lesson?.content ?? ""}
            placeholder="هدف مرحله، ماموریت کوتاه، و یک تمرین قابل انجام را بنویسید تا دانش‌آموز در دمو فقط با متن خالی روبه‌رو نشود."
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-bold text-[#d9dcf0]">آدرس ویدیو اختیاری</span>
          <input className={`${inputClass} text-left`} dir="ltr" name="videoUrl" type="url" defaultValue={lesson?.videoUrl ?? ""} />
        </label>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
        <input
          className="h-5 w-5 accent-[#39ff88]"
          name="isActive"
          type="checkbox"
          defaultChecked={lesson?.isActive ?? true}
        />
        <span className="text-sm font-bold text-white">درس فعال باشد</span>
      </label>

      {errorMessage ? (
        <p className="mt-5 rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-4 py-3 text-sm font-bold text-[#ffd6e5]">
          {errorMessage}
        </p>
      ) : null}

      {savedMessage ? (
        <p className="mt-5 rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-4 py-3 text-sm font-bold text-[#dfffea]">
          {savedMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/lessons"
          className="rounded-md border border-white/15 px-5 py-3 text-center text-sm font-black text-white hover:border-[#39ff88] hover:text-[#dfffea]"
        >
          بازگشت به درس‌ها
        </Link>
        <button className="rounded-md bg-[#9b5cff] px-6 py-3 text-sm font-black text-white" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { leadAgeRangeLabels, leadSkillLevelLabels } from "@/lib/validators/lead";
import type { LeadAgeRange, LeadSkillLevel } from "@/types";

type SubmitState =
  | "idle"
  | "submitting"
  | "success"
  | "duplicate"
  | "validationError"
  | "rateLimit"
  | "serverError";

const messages: Record<Exclude<SubmitState, "idle" | "submitting">, string> = {
  success:
    "ثبت‌نام اولیه با موفقیت انجام شد. تیم کدکرافت اطلاعات را بررسی می‌کند و از مسیرهای رسمی با شما ارتباط می‌گیرد.",
  duplicate: "این شماره قبلاً ثبت شده است. اگر منتظر تماس هستی، نیازی به ثبت دوباره نیست.",
  validationError:
    "ثبت انجام نشد. شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد؛ بقیه فیلدها را هم کامل کن.",
  rateLimit: "تعداد تلاش‌ها زیاد شده است. چند دقیقه دیگر دوباره امتحان کن.",
  serverError: "ثبت انجام نشد. لطفاً چند دقیقه دیگر دوباره امتحان کن."
};

export function BootcampLeadForm() {
  const [state, setState] = useState<SubmitState>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      ageRange: String(formData.get("ageRange") ?? ""),
      skillLevel: String(formData.get("skillLevel") ?? "")
    };

    try {
      const response = await fetch("/api/v1/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.status >= 200 && response.status < 300) {
        setState("success");
        form.reset();
        return;
      }

      if (response.status === 409) {
        setState("duplicate");
        return;
      }

      if (response.status === 400) {
        setState("validationError");
        return;
      }

      if (response.status === 429) {
        setState("rateLimit");
        return;
      }

      setState("serverError");
    } catch {
      setState("serverError");
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel neon-ring rounded-lg p-5 sm:p-6">
      <h2 className="text-2xl font-black text-white">ثبت‌نام اولیه بوت‌کمپ</h2>
      <p className="mt-2 text-sm leading-7 text-[#a9aec7]">
        چهار فیلد کوتاه برای شروع مسیر؛ اطلاعات فقط برای هماهنگی پذیرش و معرفی مینی‌دوره استفاده می‌شود.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">نام و نام خانوادگی</span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-[#39ff88]"
            name="fullName"
            required
            minLength={2}
            maxLength={80}
            placeholder="مثلا آریا رضایی"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">شماره موبایل</span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-center text-white outline-none focus:border-[#39ff88]"
            dir="ltr"
            inputMode="tel"
            name="phone"
            pattern="09[0-9]{9}"
            required
            title="شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد."
            placeholder="09123456789"
          />
          <span className="mt-2 block text-xs leading-6 text-[#a9aec7]">
            نمونه درست: 09123456789
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">بازه سنی</span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-[#151622] px-4 py-3 text-white outline-none focus:border-[#39ff88]"
            name="ageRange"
            required
            defaultValue=""
          >
            <option value="" disabled>
              انتخاب کن
            </option>
            {(Object.keys(leadAgeRangeLabels) as LeadAgeRange[]).map((key) => (
              <option key={key} value={key}>
                {leadAgeRangeLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">سطح فعلی</span>
          <select
            className="mt-2 w-full rounded-md border border-white/10 bg-[#151622] px-4 py-3 text-white outline-none focus:border-[#39ff88]"
            name="skillLevel"
            required
            defaultValue=""
          >
            <option value="" disabled>
              انتخاب کن
            </option>
            {(Object.keys(leadSkillLevelLabels) as LeadSkillLevel[]).map((key) => (
              <option key={key} value={key}>
                {leadSkillLevelLabels[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="mt-6 w-full rounded-md bg-[#9b5cff] px-5 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(155,92,255,.35)] disabled:cursor-wait disabled:opacity-70"
        disabled={state === "submitting"}
        type="submit"
        aria-busy={state === "submitting"}
      >
        {state === "submitting" ? "در حال ثبت اطلاعات..." : "شروع کمپ ۳ روزه رایگان (ظرفیت محدود) 🚀"}
      </button>

      {state === "success" ? (
        <p className="mt-4 rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-3 text-sm font-bold leading-7 text-[#dfffea]">
          {messages.success}
        </p>
      ) : null}
      {state === "duplicate" ? (
        <p className="mt-4 rounded-md border border-[#ffcc66]/30 bg-[#ffcc66]/10 px-3 py-3 text-sm font-bold leading-7 text-[#ffe8ad]">
          {messages.duplicate}
        </p>
      ) : null}
      {state === "validationError" || state === "rateLimit" || state === "serverError" ? (
        <p className="mt-4 rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-3 py-3 text-sm font-bold leading-7 text-[#ffd6e5]">
          {messages[state]}
        </p>
      ) : null}
    </form>
  );
}

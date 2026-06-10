"use client";

import { useState, type FormEvent } from "react";
import { leadAgeRangeLabels, leadSkillLevelLabels } from "@/lib/validators/lead";
import type { LeadAgeRange, LeadSkillLevel } from "@/types";

type SubmitState = "idle" | "submitting" | "success" | "error" | "duplicate";

export function BootcampLeadForm() {
  const [state, setState] = useState<SubmitState>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      ageRange: String(formData.get("ageRange") ?? ""),
      skillLevel: String(formData.get("skillLevel") ?? "")
    };

    const response = await fetch("/api/v1/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 201) {
      setState("success");
      event.currentTarget.reset();
      return;
    }

    setState(response.status === 409 ? "duplicate" : "error");
  }

  return (
    <form onSubmit={onSubmit} className="glass-panel neon-ring rounded-lg p-5 sm:p-6">
      <h2 className="text-2xl font-black text-white">ثبت‌نام اولیه بوت‌کمپ</h2>
      <p className="mt-2 text-sm leading-7 text-[#a9aec7]">چهار فیلد کوتاه؛ بدون ارسال پیامک یا اتصال بیرونی.</p>

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
            required
            placeholder="09123456789"
          />
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
      >
        {state === "submitting" ? "در حال ثبت..." : "شروع کمپ ۳ روزه رایگان (ظرفیت محدود) 🚀"}
      </button>

      {state === "success" ? <p className="mt-4 text-sm font-bold text-[#39ff88]">ثبت شد. تیم پذیرش بررسی می‌کند.</p> : null}
      {state === "duplicate" ? <p className="mt-4 text-sm font-bold text-[#ffcc66]">این شماره قبلا ثبت شده است.</p> : null}
      {state === "error" ? <p className="mt-4 text-sm font-bold text-[#ff6b9d]">ثبت انجام نشد. اطلاعات را بررسی کن.</p> : null}
    </form>
  );
}

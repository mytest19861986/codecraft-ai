"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthMode = "login" | "register";
type FormState = "idle" | "submitting" | "success" | "error";

type ApiError = {
  code?: string;
  details?: Record<string, string[] | undefined>;
};

type StudentAuthFormProps = {
  mode: AuthMode;
};

const copy = {
  login: {
    eyebrow: "ورود بازیکن",
    title: "برگرد به داشبوردت",
    description: "شماره موبایل و رمزت رو بزن تا ادامه مسیر کدنویسی و چالش ها رو از داشبورد دنبال کنی.",
    submit: "ورود به داشبورد",
    submitting: "در حال ورود...",
    alternateText: "اکانت نداری؟",
    alternateHref: "/register",
    alternateLabel: "ثبت نام کن",
    success: "ورود موفق بود. داریم داشبورد رو باز می کنیم."
  },
  register: {
    eyebrow: "ساخت اکانت دانش آموز",
    title: "اکانت CodeCraft بساز",
    description: "با یک شماره موبایل و رمز امن، آماده ورود به مسیر پروژه ها و ماموریت های CodeCraft شو.",
    submit: "ساخت اکانت",
    submitting: "در حال ساخت اکانت...",
    alternateText: "قبلا ثبت نام کردی؟",
    alternateHref: "/login",
    alternateLabel: "وارد شو",
    success: "اکانتت ساخته شد. حالا می تونی وارد بشی."
  }
} as const;

const errorMessages: Record<string, string> = {
  DUPLICATE_PHONE: "این شماره قبلا ثبت نام شده. اگر اکانت داری، از صفحه ورود استفاده کن.",
  INVALID_CREDENTIALS: "شماره موبایل یا رمز عبور درست نیست.",
  RATE_LIMIT_EXCEEDED: "تعداد تلاش ها زیاد شد. چند دقیقه صبر کن و دوباره امتحان کن.",
  VALIDATION_ERROR: "اطلاعات فرم کامل یا درست نیست. فیلدهای مشخص شده رو بررسی کن.",
  AUTH_UNAVAILABLE: "ورود فعلا در دسترس نیست. چند دقیقه بعد دوباره تلاش کن.",
  INTERNAL_SERVER_ERROR: "درخواست انجام نشد. چند دقیقه بعد دوباره امتحان کن.",
  NETWORK_ERROR: "اتصال برقرار نشد. اینترنتت رو بررسی کن و دوباره تلاش کن."
};

const fieldMessages: Record<string, string> = {
  name: "نام باید حداقل ۲ کاراکتر باشد.",
  phone: "شماره موبایل باید با 09 شروع شود و ۱۱ رقم باشد.",
  password: "رمز عبور باید حداقل ۸ کاراکتر باشد."
};

function getErrorMessage(error: ApiError | null) {
  if (!error?.code) {
    return errorMessages.INTERNAL_SERVER_ERROR;
  }

  if (error.code === "PASSWORD_MISMATCH") {
    return "رمز عبور و تکرار آن یکسان نیستند.";
  }

  return errorMessages[error.code] ?? errorMessages.INTERNAL_SERVER_ERROR;
}

function getFieldError(error: ApiError | null, field: string) {
  if (!error?.details?.[field]?.length) {
    return null;
  }

  return fieldMessages[field] ?? "این فیلد را بررسی کن.";
}

async function readApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { error?: ApiError };
    return body.error ?? {};
  } catch {
    return {};
  }
}

export function StudentAuthForm({ mode }: StudentAuthFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const content = copy[mode];
  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      ...(isRegister ? { name: String(formData.get("name") ?? "").trim() } : {}),
      phone: String(formData.get("phone") ?? "").trim(),
      password: String(formData.get("password") ?? "")
    };
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    setApiError(null);

    if (isRegister && payload.password !== confirmPassword) {
      setApiError({ code: "PASSWORD_MISMATCH" });
      setState("error");
      return;
    }

    setState("submitting");

    try {
      const response = await fetch(
        isRegister ? "/api/v1/student/register" : "/api/v1/student/session/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (response.ok) {
        setState("success");
        form.reset();

        if (isRegister) {
          return;
        }

        router.push("/dashboard");
        router.refresh();
        return;
      }

      setApiError(await readApiError(response));
      setState("error");
    } catch {
      setApiError({ code: "NETWORK_ERROR" });
      setState("error");
    }
  }

  const isSubmitting = state === "submitting";
  const messageId = `${mode}-auth-message`;

  return (
    <form onSubmit={onSubmit} className="glass-panel neon-ring w-full rounded-lg p-5 sm:p-6" noValidate>
      <div className="flex items-center justify-between gap-4">
        <p className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
          {content.eyebrow}
        </p>
        <Link href="/" className="text-xs font-bold text-[#a9aec7] transition hover:text-white">
          خانه
        </Link>
      </div>

      <h1 className="mt-5 text-2xl font-black leading-9 text-white sm:text-3xl">{content.title}</h1>
      <p className="mt-3 text-sm leading-7 text-[#a9aec7]">{content.description}</p>

      <div className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="text-sm font-bold text-[#d9dcf0]">نام</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#39ff88]"
              name="name"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              placeholder="مثلا آریا رضایی"
              aria-invalid={Boolean(getFieldError(apiError, "name"))}
            />
            {getFieldError(apiError, "name") ? (
              <span className="mt-2 block text-xs font-bold text-[#ffd6e5]">{getFieldError(apiError, "name")}</span>
            ) : null}
          </label>
        ) : null}

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">شماره موبایل</span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-center text-white outline-none transition focus:border-[#39ff88]"
            dir="ltr"
            inputMode="tel"
            name="phone"
            type="tel"
            autoComplete="tel"
            pattern="09[0-9]{9}"
            required
            placeholder="09123456789"
            aria-invalid={Boolean(getFieldError(apiError, "phone"))}
          />
          <span className="mt-2 block text-xs leading-6 text-[#a9aec7]">نمونه درست: 09123456789</span>
          {getFieldError(apiError, "phone") ? (
            <span className="mt-1 block text-xs font-bold text-[#ffd6e5]">{getFieldError(apiError, "phone")}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="text-sm font-bold text-[#d9dcf0]">رمز عبور</span>
          <input
            className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none transition focus:border-[#39ff88]"
            dir="ltr"
            name="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={8}
            maxLength={128}
            required
            placeholder="••••••••"
            aria-invalid={Boolean(getFieldError(apiError, "password"))}
          />
          <span className="mt-2 block text-xs leading-6 text-[#a9aec7]">حداقل ۸ کاراکتر؛ رمزت رو جایی ذخیره نکن.</span>
          {getFieldError(apiError, "password") ? (
            <span className="mt-1 block text-xs font-bold text-[#ffd6e5]">{getFieldError(apiError, "password")}</span>
          ) : null}
        </label>

        {isRegister ? (
          <label className="block">
            <span className="text-sm font-bold text-[#d9dcf0]">تکرار رمز عبور</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none transition focus:border-[#39ff88]"
              dir="ltr"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              aria-invalid={apiError?.code === "PASSWORD_MISMATCH"}
            />
          </label>
        ) : null}
      </div>

      <button
        className="mt-6 w-full rounded-md bg-[#22c55e] px-5 py-3 text-sm font-black text-black shadow-[0_0_15px_rgba(34,197,94,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#39ff88] hover:shadow-[0_0_25px_rgba(34,197,94,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={isSubmitting}
        type="submit"
        aria-busy={isSubmitting}
        aria-describedby={state === "success" || state === "error" ? messageId : undefined}
      >
        {isSubmitting ? content.submitting : content.submit}
      </button>

      {state === "success" ? (
        <div
          id={messageId}
          className="mt-4 rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-3 text-sm font-bold leading-7 text-[#dfffea]"
          role="status"
        >
          <span>{content.success}</span>
          {isRegister ? (
            <Link href="/login" className="mr-2 text-white underline decoration-[#39ff88] underline-offset-4">
              رفتن به ورود
            </Link>
          ) : null}
        </div>
      ) : null}

      {state === "error" ? (
        <p
          id={messageId}
          className="mt-4 rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-3 py-3 text-sm font-bold leading-7 text-[#ffd6e5]"
          role="alert"
        >
          {getErrorMessage(apiError)}
        </p>
      ) : null}

      <p className="mt-5 text-center text-sm font-bold text-[#a9aec7]">
        {content.alternateText}{" "}
        <Link href={content.alternateHref} className="text-[#39ff88] underline decoration-[#39ff88]/50 underline-offset-4">
          {content.alternateLabel}
        </Link>
      </p>
    </form>
  );
}

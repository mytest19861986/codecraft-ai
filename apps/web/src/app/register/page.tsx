import { StudentAuthForm } from "@/components/auth/student-auth-form";

export const metadata = {
  title: "ثبت نام دانش آموز",
  robots: { index: false, follow: false }
};

export default function RegisterPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-6xl gap-8 px-5 py-10 sm:px-7 sm:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-5">
      <div className="rounded-lg border border-[#39ff88]/20 bg-[#0d0d13]/80 p-5 shadow-[0_0_34px_rgba(57,255,136,0.12)] lg:p-6">
        <p className="text-sm font-black text-[#9b5cff]">Player Setup</p>
        <h2 className="mt-4 text-3xl font-black leading-[1.4] text-white sm:text-4xl">
          پروفایلت رو بساز و وارد مسیر شو.
        </h2>
        <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">
          ثبت‌نام فقط شروع ماجراست. بعد از ساخت اکانت، با همین شماره و رمز وارد داشبورد می‌شی و مرحله‌های فعال رو می‌بینی.
        </p>
        <div className="mt-6 rounded-md border border-purple-500/20 bg-black/30 p-4 font-mono text-xs leading-6 text-left text-[#e6e8f8]" dir="ltr">
          <pre className="whitespace-pre-wrap">{`player.create({
  role: "student",
  mode: "learn_by_building"
});`}</pre>
        </div>
      </div>
      <StudentAuthForm mode="register" />
    </section>
  );
}

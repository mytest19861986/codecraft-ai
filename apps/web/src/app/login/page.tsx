import { StudentAuthForm } from "@/components/auth/student-auth-form";

export const metadata = {
  title: "ورود دانش آموز",
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-6xl gap-8 px-5 py-10 sm:px-7 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-5">
      <div className="order-2 lg:order-1">
        <StudentAuthForm mode="login" />
      </div>
      <div className="order-1 rounded-lg border border-purple-500/25 bg-[#0d0d13]/80 p-5 shadow-[0_0_34px_rgba(155,92,255,0.16)] lg:order-2 lg:p-6">
        <p className="text-sm font-black text-[#39ff88]">CodeCraft AI</p>
        <h2 className="mt-4 text-3xl font-black leading-[1.4] text-white sm:text-4xl">
          ادامه بده، مرحله بعدی منتظرته.
        </h2>
        <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">
          اینجا مسیر یادگیریت مثل یک بازی جلو می‌ره: درس‌های مرحله‌ای، تمرین، XP و ساختن نمونه‌هایی که می‌تونی نشان بدهی.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {["AI", "Game", "Code"].map((item) => (
            <div key={item} className="rounded-md border border-white/10 bg-white/5 px-3 py-4 text-sm font-black text-[#39ff88]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

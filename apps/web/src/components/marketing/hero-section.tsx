import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl gap-10 px-6 py-16 sm:gap-12 sm:px-7 sm:py-18 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-8 lg:px-5">
        <div className="pt-2 sm:pt-0">
          <p className="mb-4 inline-flex rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
            آکادمی کدنویسی، AI و بازی‌سازی
          </p>
          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl sm:leading-snug lg:text-6xl">
            کدهای سنتی رو دفن کن؛
            <span className="mt-2 block text-[#39ff88]">بازی و هوش مصنوعی خودت رو بساز!</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-9 text-[#d9dcf0] sm:mt-7 sm:text-lg">
            از صفر مطلق تا خروجی‌های واقعی؛ بدون حفظ کردن فرمول‌های خشک مدرسه‌ای. توی آکادمی کدکرافت، مهندسی پرامپت و تفکر الگوریتمی رو به روش گیمینگ و پروژه‌محور یاد می‌گیری.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/bootcamp"
              className="inline-flex items-center justify-center rounded-md bg-[#22c55e] px-6 py-4 text-sm font-black text-black shadow-[0_0_15px_rgba(34,197,94,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#39ff88] hover:shadow-[0_0_25px_rgba(34,197,94,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12]"
            >
              شروع کمپ ۳ روزه رایگان (ظرفیت محدود) 🚀
            </Link>
            <Link
              href="/free-lesson"
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-black text-white transition duration-200 hover:-translate-y-0.5 hover:border-[#39ff88]/45 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12]"
            >
              دیدن درس رایگان
            </Link>
          </div>
          <p className="mt-4 text-sm font-bold text-[#a9aec7]">بدون نیاز به پیش‌زمینه | مسیر شروع پس از ثبت‌نام اطلاع‌رسانی می‌شود</p>
        </div>

        <div className="rounded-lg border border-purple-500/30 bg-[#0d0d13] p-3 shadow-[0_0_30px_rgba(168,85,247,0.15)] sm:p-4">
          <div className="rounded-lg border border-white/10 bg-[#10111a] p-3 shadow-[inset_0_0_24px_rgba(168,85,247,0.06)] sm:p-4">
            <div className="mb-4 flex gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#ffbd2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <pre className="overflow-x-auto whitespace-pre rounded-md bg-black/30 p-4 text-left font-mono text-xs leading-6 text-[#d9dcf0] md:p-6 md:text-sm" dir="ltr">
{`const mission = {
  player: "teen_builder",
  skill: ["prompting", "algorithms", "games"],
  mode: "project_based",
  status: "level_up"
};`}
            </pre>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {["100 XP", "AI", "Game"].map((item) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/5 px-3 py-4 text-sm font-black text-[#39ff88]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-8 px-5 py-12 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
            آکادمی کدنویسی، AI و بازی‌سازی
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl">
            کدهای سنتی رو دفن کن؛
            <span className="mt-2 block text-[#39ff88]">بازی و هوش مصنوعی خودت رو بساز!</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-9 text-[#d9dcf0] sm:text-lg">
            از صفر مطلق تا خروجی‌های واقعی؛ بدون حفظ کردن فرمول‌های خشک مدرسه‌ای. توی آکادمی کدکرافت، مهندسی پرامپت و تفکر الگوریتمی رو به روش گیمینگ و پروژه‌محور یاد می‌گیری.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/bootcamp"
              className="inline-flex items-center justify-center rounded-md bg-[#9b5cff] px-6 py-4 text-sm font-black text-white shadow-[0_0_34px_rgba(155,92,255,.42)]"
            >
              شروع کمپ ۳ روزه رایگان (ظرفیت محدود) 🚀
            </Link>
            <Link
              href="/free-lesson"
              className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-4 text-sm font-black text-white"
            >
              دیدن درس رایگان
            </Link>
          </div>
          <p className="mt-4 text-sm font-bold text-[#a9aec7]">بدون نیاز به پیش‌زمینه | دسترسی آنی در وب‌سایت</p>
        </div>

        <div className="glass-panel neon-ring rounded-lg p-4">
          <div className="rounded-lg bg-[#10111a] p-4">
            <div className="mb-4 flex gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#ffbd2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <pre className="overflow-hidden whitespace-pre-wrap text-left text-xs leading-6 text-[#d9dcf0] sm:text-sm" dir="ltr">
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

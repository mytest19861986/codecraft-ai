import { SectionHeading } from "@/components/ui/section-heading";

const levels = [
  {
    title: "LEVEL 01 // تفکر الگوریتمی و وب مدرن (۱۰۰ XP)",
    description:
      "درک منطق برنامه‌نویسی و اصول فرانت‌اِند. یاد می‌گیری چطور ظاهر یک سایت ریسپانسیو و مدرن رو با ابزارهای کمکی AI طراحی کنی.",
    capstone: "طراحی و دیپلوای سایت هوشمند شخصی و لندینگ‌پیج گیمینگ."
  },
  {
    title: "LEVEL 02 // مهندسی منطق با پایتون (۲۵۰ XP)",
    description:
      "ورود به دنیای شیء‌گرایی و پردازش داده‌ها. کدهای پایتون رو یاد می‌گیری و یاد می‌گیری چطور مغز ابزارهای دیجیتال رو فرماندهی کنی.",
    capstone: "طراحی نمونه آموزشی دستیار هوشمند با تمرکز روی منطق، پرامپت و تجربه کاربری؛ اتصال API در فازهای بعدی بررسی می‌شود."
  },
  {
    title: "LEVEL 03 // توسعه مینی‌اپ‌های فول‌استک (۵۰۰ XP)",
    description:
      "ساخت دیتابیس، معماری بک‌اِند و طراحی تجربه مینی‌اپ‌های فول‌استک برای محصول‌های کوچک و قابل تست.",
    capstone: "ساخت نمونه مینی‌اپ فروشگاهی/بازی با جریان‌های شبیه‌سازی‌شده؛ اتصال تلگرام و پرداخت در دامنه MVP فعلی نیست."
  },
  {
    title: "LEVEL 04 // شتاب‌دهی بازی‌سازی تجاری (۱۰۰۰ XP)",
    description:
      "توسعه بازی‌های دو بعدی پیشرفته، بهینه‌سازی کدهای سنگین و پکیج کردن نهایی محصول برای مارکت‌های بزرگ.",
    capstone: "انتشار یک بازی پلتفرمر چالش‌برانگیز در کافه‌بازار یا مایکت."
  }
];

export function LevelsSection() {
  const xpLabels = ["100 XP", "250 XP", "500 XP", "1000 XP"];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <SectionHeading
        eyebrow="Level Map"
        title="مسیر لول‌آپ و نقشه راه مهارتی"
        subtitle="تا غول مرحله قبل رو شکست ندی، ماتریکس بعدی برات باز نمیشه!"
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {levels.map((level, index) => (
          <article
            key={level.title}
            className="group rounded-lg border border-purple-500/25 bg-[#12131d] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(155,92,255,.16)] sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-1.5 text-xs font-black text-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,.18)]">
                LEVEL 0{index + 1}
              </p>
              <p className="rounded-md border border-[#39ff88]/45 bg-[#39ff88]/15 px-3 py-1.5 text-xs font-black text-[#ecfff4] shadow-[0_0_20px_rgba(57,255,136,.22)]">
                {xpLabels[index]}
              </p>
            </div>
            <h3 className="mt-5 text-xl font-black leading-8 text-white transition-colors duration-300 group-hover:text-[#39ff88] sm:leading-9">{level.title}</h3>
            <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">{level.description}</p>
            <div className="mt-6 rounded-md border border-[#9b5cff]/40 bg-[#9b5cff]/10 p-4 shadow-[inset_0_0_24px_rgba(155,92,255,.1)]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c9adff]">Capstone</p>
              <p className="mt-2 text-sm leading-8 text-[#eef0ff]">{level.capstone}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

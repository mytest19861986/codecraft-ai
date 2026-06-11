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
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <SectionHeading
        eyebrow="Level Map"
        title="مسیر لول‌آپ و نقشه راه مهارتی"
        subtitle="تا غول مرحله قبل رو شکست ندی، ماتریکس بعدی برات باز نمیشه!"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {levels.map((level, index) => (
          <article key={level.title} className="glass-panel rounded-lg p-5">
            <p className="text-xs font-black text-[#39ff88]">0{index + 1}</p>
            <h3 className="mt-3 text-xl font-black leading-8 text-white">{level.title}</h3>
            <p className="mt-4 text-sm leading-8 text-[#d9dcf0]">{level.description}</p>
            <div className="mt-5 rounded-md border border-[#9b5cff]/35 bg-[#9b5cff]/10 p-4">
              <p className="text-xs font-black text-[#9b5cff]">Capstone</p>
              <p className="mt-2 text-sm leading-7 text-white">{level.capstone}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    question: "آیا فرزند من برای شروع باید برنامه‌نویسی بلد باشد؟",
    answer:
      "خیر. Level 1 برای شروع از صفر طراحی شده و با تفکر الگوریتمی، وب مدرن، و تمرین‌های کوچک شروع می‌شود."
  },
  {
    question: "آیا این دوره فقط بازی و سرگرمی است؟",
    answer:
      "فضا گیمینگ است، اما هدف مهارت واقعی است: حل مسئله، ساخت پروژه، نظم فکری، و استفاده مسئولانه از ابزارهای هوش مصنوعی."
  },
  {
    question: "اگر مسیر برای فرزندم مناسب نبود چه می‌شود؟",
    answer:
      "سیاست انصراف و بازگشت وجه قبل از ثبت‌نام قطعی به‌صورت شفاف اعلام می‌شود تا خانواده با خیال روشن تصمیم بگیرد."
  }
];

export function ParentsFaqSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <SectionHeading
        eyebrow="FAQ"
        title="سوال‌های پرتکرار والدین"
        subtitle="پاسخ‌های کوتاه برای تصمیم‌گیری دقیق‌تر خانواده."
      />
      <div className="mt-8 grid gap-4">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-lg border border-white/12 bg-white/[0.055] px-5 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.18)] backdrop-blur-md sm:px-7 sm:py-7">
            <h3 className="text-lg font-black leading-9 text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-8 text-[#d9dcf0] sm:leading-9">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

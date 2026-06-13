import { ParentsFaqSection } from "@/components/marketing/parents-faq-section";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "والدین"
};

export default function ParentsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
      <SectionHeading
        eyebrow="برای والدین"
        title="یادگیری جدی، با زبان نسل بازی‌ساز"
        subtitle="کدکرافت برای نوجوانی ساخته شده که می‌خواهد خروجی واقعی بسازد، نه فقط چند تعریف حفظ کند. مسیرها مرحله‌ای، قابل پیگیری، و مناسب گفت‌وگوی خانواده طراحی شده‌اند."
      />
      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {[
          ["تمرکز روی مهارت", "تفکر الگوریتمی، ساخت پروژه، و سواد هوش مصنوعی."],
          ["مناسب شروع از صفر", "مسیر سطح‌بندی شده برای سنین ۱۲ تا ۲۰ سال."],
          ["شفافیت مسیر", "هر سطح با خروجی و معیار پیشرفت مشخص طراحی می‌شود."]
        ].map(([title, text]) => (
          <div key={title} className="glass-panel rounded-lg border-white/12 p-5 sm:p-6">
            <h2 className="font-black leading-7 text-white">{title}</h2>
            <p className="mt-3 text-sm leading-8 text-[#c4c8dd]">{text}</p>
          </div>
        ))}
      </div>
      <ParentsFaqSection />
    </section>
  );
}

import { SectionHeading } from "@/components/ui/section-heading";

export function WelcomeKitSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:py-20">
      <div className="glass-panel rounded-lg p-6 sm:p-8">
        <SectionHeading
          eyebrow="Welcome Kit"
          title="کیت شروع برای ثبت‌نام قطعی Level 1"
          subtitle="پس از تایید نهایی و ثبت‌نام قطعی در Level 1، کیت خوشامدگویی می‌تواند به‌عنوان بخشی از تجربه شروع دوره ارائه شود. جزئیات نهایی بسته، زمان ارسال، و موجودی در مرحله بعد رسمی می‌شود."
        />
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {["چک‌لیست شروع", "نقشه XP", "راهنمای والدین"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-black text-white">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

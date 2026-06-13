import { SectionHeading } from "@/components/ui/section-heading";

export function WelcomeKitSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
      <div className="glass-panel rounded-lg p-6 sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="Welcome Kit"
          title="کیت شروع برای ثبت‌نام قطعی Level 1"
          subtitle="پس از تایید نهایی و ثبت‌نام قطعی در Level 1، کیت خوشامدگویی می‌تواند به‌عنوان بخشی از تجربه شروع دوره ارائه شود. جزئیات نهایی بسته، زمان ارسال، و موجودی در مرحله بعد رسمی می‌شود."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {["چک‌لیست شروع", "نقشه XP", "راهنمای والدین"].map((item) => (
            <div key={item} className="rounded-lg border border-purple-500/20 bg-[#12121a]/80 p-5 text-sm font-black leading-7 text-white shadow-[0_0_24px_rgba(168,85,247,0.08)] sm:p-6">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

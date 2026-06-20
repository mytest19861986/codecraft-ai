import { SectionHeading } from "@/components/ui/section-heading";

export function WelcomeKitSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24">
      <div className="glass-panel rounded-lg p-6 sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow="راهنمای شروع"
          title="شروع منظم، نه شروع هیجانی و مبهم"
          subtitle="بعد از هماهنگی اولیه، خانواده و دانش‌آموز باید بدانند مسیر از کجا شروع می‌شود، چه چیزی تمرین می‌شود و پیشرفت چطور دیده می‌شود. این بخش درباره راهنمای دیجیتال شروع است، نه بسته فیزیکی یا وعده ارسال."
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

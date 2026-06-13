import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "درس رایگان"
};

export default function FreeLessonPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Lesson Preview"
        title="پیش‌نمایش درس رایگان: منطق یک بازی ساده"
        subtitle="این صفحه فعلاً یک تیزر آماده‌نمایش از سبک یادگیری کدکرافت است؛ ویدئوی واقعی و محتوای کامل درس در فاز بعدی منتشر می‌شود."
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel neon-ring rounded-lg p-5 sm:p-8">
          <div className="aspect-video rounded-lg border border-white/10 bg-[#151622] p-5">
            <div className="flex h-full flex-col justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#39ff88]">
                coming soon
              </p>

              <div>
                <h2 className="text-2xl font-black text-white">
                  الگوریتم یعنی نقشه حمله
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a9aec7]">
                  در نسخه کامل، مسئله را به مرحله‌های کوچک تقسیم می‌کنیم و با شبه‌کد، مسیر ساخت یک بازی حدس عدد را طراحی می‌کنیم.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="glass-panel rounded-lg p-5">
          <h3 className="text-xl font-black text-white">بعد از این درس</h3>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#d9dcf0]">
            <li>مسیر حل مسئله را قبل از کدنویسی می‌چینی.</li>
            <li>با شرط‌ها و حلقه‌ها در ذهن آشنا می‌شوی.</li>
            <li>برای کمپ ۳ روزه آماده‌تر وارد می‌شوی.</li>
          </ul>

          <Link
            href="/bootcamp"
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#22c55e] px-5 py-3 text-sm font-black text-black shadow-[0_0_15px_rgba(34,197,94,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#39ff88] hover:shadow-[0_0_25px_rgba(34,197,94,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12]"
          >
            ثبت‌نام در کمپ ۳ روزه
          </Link>
        </aside>
      </div>
    </section>
  );
}

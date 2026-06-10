import { BootcampLeadForm } from "@/components/forms/bootcamp-lead-form";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = {
  title: "ثبت‌نام کمپ رایگان"
};

export default function BootcampPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-start">
      <div className="pt-4">
        <SectionHeading
          eyebrow="کمپ ۳ روزه رایگان"
          title="شروع سریع، پروژه واقعی، بدون نیاز به پیش‌زمینه"
          subtitle="اطلاعات اولیه رو وارد کن تا تیم کدکرافت برای هماهنگی مسیر مناسب باهات تماس بگیره. در این نسخه هیچ پیامک یا سرویس بیرونی ارسال نمی‌شود."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["چالش‌های کوتاه", "منتورینگ سبک", "خروجی قابل نمایش"].map((item) => (
            <div key={item} className="glass-panel rounded-lg p-4 text-sm font-bold text-white">
              {item}
            </div>
          ))}
        </div>
      </div>
      <BootcampLeadForm />
    </section>
  );
}

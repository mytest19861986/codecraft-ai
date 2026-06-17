import Link from "next/link";

export const metadata = {
  title: "داشبورد دانش آموز",
  robots: { index: false, follow: false }
};

export default function DashboardPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-4xl items-center px-5 py-12">
      <div className="glass-panel neon-ring w-full rounded-lg p-6 sm:p-8">
        <p className="text-sm font-black text-[#39ff88]">Student Dashboard</p>
        <h1 className="mt-3 text-3xl font-black leading-10 text-white">داشبوردت آماده است</h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-[#d9dcf0]">
          ورود موفق بود. این صفحه فعلا یک جایگاه موقت برای داشبورد دانش آموزه تا مسیر ورود کامل و بدون خطای 404 کار کنه.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-black text-white transition hover:border-[#39ff88]/45 hover:bg-white/[0.07]"
        >
          برگشت به خانه
        </Link>
      </div>
    </section>
  );
}

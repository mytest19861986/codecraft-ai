import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="mb-3 text-sm font-bold text-[#39ff88]">404</p>
      <h1 className="text-3xl font-black text-white sm:text-5xl">این مرحله هنوز باز نشده</h1>
      <p className="mt-5 max-w-xl text-base leading-8 text-[#a9aec7]">
        صفحه‌ای که دنبالش بودی در نقشه راه فعلی وجود ندارد.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-[#9b5cff] px-5 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(155,92,255,.35)]"
      >
        برگشت به خانه
      </Link>
    </section>
  );
}

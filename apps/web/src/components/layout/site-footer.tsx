import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[#a9aec7] sm:flex-row sm:items-center sm:justify-between">
        <p>CodeCraft AI - آکادمی پروژه‌محور کدنویسی و هوش مصنوعی</p>
        <div className="flex gap-4">
          <Link href="/parents">والدین</Link>
          <Link href="/admin/login">ورود ادمین</Link>
        </div>
      </div>
    </footer>
  );
}

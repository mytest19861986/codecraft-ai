import Link from "next/link";

const navItems = [
  { href: "/", label: "خانه" },
  { href: "/bootcamp", label: "بوت‌کمپ" },
  { href: "/free-lesson", label: "درس رایگان" },
  { href: "/parents", label: "والدین" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0e12]/78 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-[#9b5cff] font-black text-white shadow-[0_0_24px_rgba(155,92,255,.45)]">
            CC
          </span>
          <span className="text-sm font-black text-white sm:text-base">CodeCraft AI</span>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-[#d9dcf0] hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="/bootcamp"
          className="rounded-md bg-[#39ff88] px-3 py-2 text-xs font-black text-[#0d0e12] sm:px-4"
        >
          شروع رایگان
        </Link>
      </nav>
    </header>
  );
}

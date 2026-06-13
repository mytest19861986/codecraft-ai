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
          className="rounded-md bg-[#22c55e] px-3 py-2 text-xs font-black text-black shadow-[0_0_15px_rgba(34,197,94,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#39ff88] hover:shadow-[0_0_25px_rgba(34,197,94,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39ff88] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0e12] sm:px-4"
        >
          شروع رایگان
        </Link>
      </nav>
    </header>
  );
}

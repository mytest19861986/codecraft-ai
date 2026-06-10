export const metadata = {
  title: "ورود ادمین"
};

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-5 py-12">
      <div className="glass-panel neon-ring w-full rounded-lg p-6">
        <p className="text-sm font-bold text-[#39ff88]">Admin</p>
        <h1 className="mt-2 text-2xl font-black text-white">ورود مدیریت</h1>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-[#d9dcf0]">شماره موبایل</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none focus:border-[#9b5cff]"
              dir="ltr"
              inputMode="tel"
              placeholder="09123456789"
            />
          </label>
          <label className="block">
            <span className="text-sm text-[#d9dcf0]">رمز عبور</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none focus:border-[#9b5cff]"
              dir="ltr"
              type="password"
              placeholder="••••••••"
            />
          </label>
          <button
            className="w-full rounded-md bg-[#9b5cff] px-5 py-3 text-sm font-black text-white"
            type="button"
          >
            ورود آزمایشی
          </button>
        </form>
        <p className="mt-4 text-xs leading-6 text-[#a9aec7]">
          این صفحه در تسک ۰۰۱ فقط اسکلت رابط کاربری است و احراز هویت واقعی ندارد.
        </p>
      </div>
    </section>
  );
}

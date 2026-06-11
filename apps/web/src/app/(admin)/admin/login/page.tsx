export const metadata = {
  title: "ورود ادمین"
};

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const hasError = params?.error === "invalid";

  return (
    <section dir="rtl" className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-5 py-12">
      <div className="glass-panel neon-ring w-full rounded-lg p-6">
        <p className="text-sm font-bold text-[#39ff88]">Admin</p>
        <h1 className="mt-2 text-2xl font-black text-white">ورود مدیریت</h1>
        <form action="/admin/login" method="post" className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-[#d9dcf0]">رمز عبور</span>
            <input
              className="mt-2 w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-left text-white outline-none focus:border-[#9b5cff]"
              dir="ltr"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </label>
          {hasError ? (
            <p className="rounded-md border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 px-3 py-2 text-sm font-bold text-[#ffd6e5]">
              رمز عبور نادرست است.
            </p>
          ) : null}
          <button className="w-full rounded-md bg-[#9b5cff] px-5 py-3 text-sm font-black text-white" type="submit">
            ورود
          </button>
        </form>
      </div>
    </section>
  );
}

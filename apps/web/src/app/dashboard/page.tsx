import { redirect } from "next/navigation";
import { StudentLogoutButton } from "@/components/auth/student-logout-button";
import { getAuthenticatedStudent } from "@/lib/security/student-auth";

export const metadata = {
  title: "داشبورد دانش آموز",
  robots: { index: false, follow: false }
};

export default async function DashboardPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect("/login");
  }

  const xpPerLevel = 100;
  const xpIntoLevel = student.xp % xpPerLevel;
  const progressPercent = Math.min(100, Math.max(0, xpIntoLevel));

  return (
    <section className="mx-auto flex min-h-[calc(100svh-8rem)] w-full max-w-5xl items-center px-5 py-10 sm:px-7 sm:py-14 lg:px-5">
      <div className="glass-panel neon-ring w-full rounded-lg p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-black text-[#39ff88]">
              Student Dashboard
            </p>
            <h1 className="mt-5 text-2xl font-black leading-10 text-white sm:text-3xl">
              سلام {student.name}، به داشبورد CodeCraft خوش اومدی
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-[#a9aec7]">
              اینجا فضای امن یادگیری توست. امتیاز تجربه ات با فعالیت های ساده رشد می کند و مسیر پیشرفتت را نشان می دهد.
            </p>
          </div>
          <StudentLogoutButton />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black text-[#39ff88]">پروفایل دانش آموز</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-bold text-[#a9aec7]">نام</dt>
                <dd className="mt-1 font-black text-white">{student.name}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#a9aec7]">شماره موبایل</dt>
                <dd className="mt-1 font-black text-white" dir="ltr">
                  {student.phone}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#a9aec7]">Level</dt>
                <dd className="mt-1 font-black text-white">{student.level}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#a9aec7]">XP</dt>
                <dd className="mt-1 font-black text-white">{student.xp}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-[#39ff88]/20 bg-[#39ff88]/[0.06] p-5">
            <p className="text-xs font-black text-[#39ff88]">XP Progress</p>
            <h2 className="mt-4 text-xl font-black leading-9 text-white sm:text-2xl">Level {student.level}</h2>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#a9aec7]">Total XP</p>
                <p className="mt-1 text-3xl font-black text-white">{student.xp}</p>
              </div>
              <p className="text-sm font-black text-[#d9dcf0]">
                {xpIntoLevel}/{xpPerLevel}
              </p>
            </div>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40"
              role="progressbar"
              aria-label="XP progress"
              aria-valuemin={0}
              aria-valuemax={xpPerLevel}
              aria-valuenow={xpIntoLevel}
            >
              <div
                className="h-full rounded-full bg-[#39ff88] shadow-[0_0_18px_rgba(57,255,136,0.55)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

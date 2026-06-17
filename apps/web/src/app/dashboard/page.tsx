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
              اینجا فضای امن یادگیری توست. فعلا فقط پوسته محافظت شده داشبورد فعال شده و محتوای آموزشی به زودی اضافه میشه.
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
            </dl>
          </div>

          <div className="rounded-lg border border-[#39ff88]/20 bg-[#39ff88]/[0.06] p-5">
            <p className="text-xs font-black text-[#39ff88]">Coming Soon</p>
            <h2 className="mt-4 text-xl font-black leading-9 text-white sm:text-2xl">
              داشبورد آموزشی به زودی
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#d9dcf0]">
              XP، مسیر پیشرفت، تمرین ها و محتوای دوره هنوز پیاده سازی نشده اند. این نسخه فقط ورود امن و نمایش اطلاعات پایه
              دانش آموز را انجام می دهد.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const leads = [
  {
    fullName: "نمونه ثبت‌نام",
    phone: "09123456789",
    status: "NEW",
    ageRange: "AGE_15_17"
  }
];

export const metadata = {
  title: "لیدهای ادمین"
};

export default async function AdminLeadsPage() {
  const adminSecret = process.env.ADMIN_SESSION_SECRET;
  const adminSession = (await cookies()).get("codecraft_admin_session")?.value;

  if (!adminSecret || adminSession !== adminSecret) {
    redirect("/admin/login");
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#39ff88]">Admin Leads</p>
          <h1 className="mt-2 text-3xl font-black text-white">لیدهای بوت‌کمپ</h1>
        </div>
        <span className="rounded-md border border-white/10 px-3 py-2 text-xs text-[#a9aec7]">
          اسکلت بدون اتصال به دیتابیس
        </span>
      </div>
      <div className="glass-panel mt-8 overflow-hidden rounded-lg">
        <div className="grid grid-cols-4 border-b border-white/10 px-4 py-3 text-xs font-bold text-[#a9aec7]">
          <span>نام</span>
          <span>موبایل</span>
          <span>سن</span>
          <span>وضعیت</span>
        </div>
        {leads.map((lead) => (
          <div key={lead.phone} className="grid grid-cols-4 px-4 py-4 text-sm text-white">
            <span>{lead.fullName}</span>
            <span dir="ltr" className="text-left">
              {lead.phone}
            </span>
            <span>{lead.ageRange}</span>
            <span className="text-[#39ff88]">{lead.status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

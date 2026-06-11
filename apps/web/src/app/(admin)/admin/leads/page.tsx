import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from "@/lib/security/admin-session";
import { leadAgeRangeLabels, leadSkillLevelLabels } from "@/lib/validators/lead";
import type { LeadAgeRange, LeadSkillLevel, LeadStatus } from "@/types";

const ui = {
  pageTitle: "لیدهای ادمین",
  heading: "لیدهای بوت‌کمپ",
  banner: "نمای محافظت‌شده MVP؛ فقط برای بررسی اولیه لیدها",
  countLabel: "تعداد لیدها",
  emptyTitle: "هنوز هیچ لیدی ثبت نشده است.",
  emptyDescription: "بعد از ارسال فرم بوت‌کمپ، اطلاعات اینجا نمایش داده می‌شود.",
  columns: {
    name: "نام",
    phone: "موبایل",
    age: "سن",
    skill: "سطح مهارت",
    parentPhone: "موبایل والد",
    city: "شهر",
    status: "وضعیت",
    createdAt: "تاریخ ثبت"
  }
} as const;

const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "جدید",
  CONTACTED: "تماس گرفته شده",
  REGISTERED: "ثبت‌نام شده",
  REJECTED: "رد شده"
};

const leadStatusClasses: Record<LeadStatus, string> = {
  NEW: "border-[#39ff88]/30 bg-[#39ff88]/10 text-[#dfffea]",
  CONTACTED: "border-[#66d9ff]/30 bg-[#66d9ff]/10 text-[#d5f4ff]",
  REGISTERED: "border-[#9b5cff]/30 bg-[#9b5cff]/10 text-[#eadfff]",
  REJECTED: "border-[#ff6b9d]/30 bg-[#ff6b9d]/10 text-[#ffd6e5]"
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short"
});

export const metadata = {
  title: ui.pageTitle
};

export default async function AdminLeadsPage() {
  const adminSession = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!verifyAdminSessionCookie(adminSession)) {
    redirect("/admin/login");
  }

  const leads = await prisma.bootcampLead.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      ageRange: true,
      skillLevel: true,
      parentPhone: true,
      city: true,
      status: true,
      createdAt: true
    }
  });

  return (
    <section dir="rtl" className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-[#39ff88]">Admin Leads</p>
          <h1 className="mt-2 text-3xl font-black text-white">{ui.heading}</h1>
          <p className="mt-3 text-sm font-bold text-[#d9dcf0]">
            {ui.countLabel}: <span className="text-[#39ff88]">{leads.length.toLocaleString("fa-IR")}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <span className="w-fit rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-bold text-[#dfffea]">
            {ui.banner}
          </span>
          <form action="/admin/session" method="post">
            <button className="rounded-md border border-white/15 px-4 py-2 text-sm font-bold text-white hover:border-[#ff6b9d] hover:text-[#ffd6e5]" type="submit">
              خروج
            </button>
          </form>
        </div>
      </div>

      <div className="glass-panel neon-ring mt-8 overflow-hidden rounded-lg">
        {leads.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-lg font-black text-white">{ui.emptyTitle}</p>
            <p className="mt-2 text-sm text-[#a9aec7]">{ui.emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-[1.2fr_1fr_0.9fr_1fr_1fr_0.9fr_0.9fr_1fr] gap-3 border-b border-white/10 px-4 py-3 text-xs font-bold text-[#a9aec7]">
                <span>{ui.columns.name}</span>
                <span>{ui.columns.phone}</span>
                <span>{ui.columns.age}</span>
                <span>{ui.columns.skill}</span>
                <span>{ui.columns.parentPhone}</span>
                <span>{ui.columns.city}</span>
                <span>{ui.columns.status}</span>
                <span>{ui.columns.createdAt}</span>
              </div>

              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="grid grid-cols-[1.2fr_1fr_0.9fr_1fr_1fr_0.9fr_0.9fr_1fr] gap-3 border-b border-white/10 px-4 py-4 text-sm text-white last:border-b-0"
                >
                  <span className="font-bold">{lead.fullName}</span>
                  <span dir="ltr" className="text-left font-mono text-[#dfe2f3]">
                    {lead.phone}
                  </span>
                  <span className="text-[#dfe2f3]">{leadAgeRangeLabels[lead.ageRange as LeadAgeRange]}</span>
                  <span className="text-[#dfe2f3]">{leadSkillLevelLabels[lead.skillLevel as LeadSkillLevel]}</span>
                  <span dir="ltr" className="text-left font-mono text-[#dfe2f3]">
                    {lead.parentPhone || "ثبت نشده"}
                  </span>
                  <span className="text-[#dfe2f3]">{lead.city || "ثبت نشده"}</span>
                  <span className={`w-fit rounded-md border px-2 py-1 text-xs font-black ${leadStatusClasses[lead.status as LeadStatus]}`}>
                    {leadStatusLabels[lead.status as LeadStatus]}
                  </span>
                  <time dir="ltr" className="text-left text-[#a9aec7]" dateTime={lead.createdAt.toISOString()}>
                    {dateFormatter.format(lead.createdAt)}
                  </time>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

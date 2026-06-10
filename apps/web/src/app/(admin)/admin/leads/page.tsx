import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { leadAgeRangeLabels, leadSkillLevelLabels } from "@/lib/validators/lead";
import type { LeadAgeRange, LeadSkillLevel, LeadStatus } from "@/types";

const ui = {
  pageTitle: "\u{644}\u{6cc}\u{62f}\u{647}\u{627}\u{6cc} \u{627}\u{62f}\u{645}\u{6cc}\u{646}",
  heading: "\u{644}\u{6cc}\u{62f}\u{647}\u{627}\u{6cc} \u{628}\u{648}\u{62a}\u{200c}\u{6a9}\u{645}\u{67e}",
  banner: "\u{646}\u{645}\u{627}\u{6cc} \u{645}\u{62d}\u{627}\u{641}\u{638}\u{62a}\u{200c}\u{634}\u{62f}\u{647} MVP\u{61b} \u{641}\u{642}\u{637} \u{628}\u{631}\u{627}\u{6cc} \u{628}\u{631}\u{631}\u{633}\u{6cc} \u{627}\u{648}\u{644}\u{6cc}\u{647} \u{644}\u{6cc}\u{62f}\u{647}\u{627}",
  emptyTitle: "\u{647}\u{646}\u{648}\u{632} \u{647}\u{6cc}\u{686} \u{644}\u{6cc}\u{62f}\u{6cc} \u{62b}\u{628}\u{62a} \u{646}\u{634}\u{62f}\u{647} \u{627}\u{633}\u{62a}.",
  emptyDescription: "\u{628}\u{639}\u{62f} \u{627}\u{632} \u{627}\u{631}\u{633}\u{627}\u{644} \u{641}\u{631}\u{645} \u{628}\u{648}\u{62a}\u{200c}\u{6a9}\u{645}\u{67e}\u{60c} \u{627}\u{637}\u{644}\u{627}\u{639}\u{627}\u{62a} \u{627}\u{6cc}\u{646}\u{62c}\u{627} \u{646}\u{645}\u{627}\u{6cc}\u{634} \u{62f}\u{627}\u{62f}\u{647} \u{645}\u{6cc}\u{200c}\u{634}\u{648}\u{62f}.",
  columns: {
    name: "\u{646}\u{627}\u{645}",
    phone: "\u{645}\u{648}\u{628}\u{627}\u{6cc}\u{644}",
    age: "\u{633}\u{646}",
    skill: "\u{633}\u{637}\u{62d} \u{645}\u{647}\u{627}\u{631}\u{62a}",
    parentPhone: "\u{645}\u{648}\u{628}\u{627}\u{6cc}\u{644} \u{648}\u{627}\u{644}\u{62f}",
    city: "\u{634}\u{647}\u{631}",
    status: "\u{648}\u{636}\u{639}\u{6cc}\u{62a}",
    createdAt: "\u{62a}\u{627}\u{631}\u{6cc}\u{62e} \u{62b}\u{628}\u{62a}"
  }
} as const;

const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: "\u{62c}\u{62f}\u{6cc}\u{62f}",
  CONTACTED: "\u{62a}\u{645}\u{627}\u{633} \u{6af}\u{631}\u{641}\u{62a}\u{647} \u{634}\u{62f}\u{647}",
  REGISTERED: "\u{62b}\u{628}\u{62a}\u{200c}\u{646}\u{627}\u{645} \u{634}\u{62f}\u{647}",
  REJECTED: "\u{631}\u{62f} \u{634}\u{62f}\u{647}"
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "medium",
  timeStyle: "short"
});

export const metadata = {
  title: ui.pageTitle
};

export default async function AdminLeadsPage() {
  const adminSecret = process.env.ADMIN_SESSION_SECRET;
  const adminSession = (await cookies()).get("codecraft_admin_session")?.value;

  if (!adminSecret || adminSession !== adminSecret) {
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
        </div>
        <span className="w-fit rounded-md border border-[#39ff88]/30 bg-[#39ff88]/10 px-3 py-2 text-xs font-bold text-[#dfffea]">
          {ui.banner}
        </span>
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
                  <span>{leadAgeRangeLabels[lead.ageRange as LeadAgeRange]}</span>
                  <span>{leadSkillLevelLabels[lead.skillLevel as LeadSkillLevel]}</span>
                  <span dir="ltr" className="text-left font-mono text-[#dfe2f3]">
                    {lead.parentPhone || "\u{2014}"}
                  </span>
                  <span>{lead.city || "\u{2014}"}</span>
                  <span className="font-bold text-[#39ff88]">
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
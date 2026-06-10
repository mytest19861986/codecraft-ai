import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="text-sm font-black text-[#39ff88]">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-8 text-[#a9aec7]">{subtitle}</p> : null}
    </div>
  );
}

import { z } from "zod";

const iranianMobileRegex = /^09\d{9}$/;

export const leadAgeRangeLabels = {
  AGE_12_14: "۱۲ تا ۱۴ سال",
  AGE_15_17: "۱۵ تا ۱۷ سال",
  AGE_18_20: "۱۸ تا ۲۰ سال"
} as const;

export const leadSkillLevelLabels = {
  ABSOLUTE_BEGINNER: "صفر مطلق",
  BASIC: "آشنایی پایه",
  PREVIOUS_CLASS: "قبلا کلاس رفته‌ام"
} as const;

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/\s|-/g, "");
}

const phoneSchema = z
  .string()
  .trim()
  .transform(normalizeDigits)
  .refine((value) => iranianMobileRegex.test(value), "شماره موبایل معتبر نیست.");

export const leadCreateSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  ageRange: z.enum(["AGE_12_14", "AGE_15_17", "AGE_18_20"]),
  skillLevel: z.enum(["ABSOLUTE_BEGINNER", "BASIC", "PREVIOUS_CLASS"]),
  parentPhone: phoneSchema.optional(),
  city: z.string().trim().min(2).max(80).optional(),
  source: z.string().trim().min(2).max(80).optional()
});

export type LeadCreateInput = z.infer<typeof leadCreateSchema>;

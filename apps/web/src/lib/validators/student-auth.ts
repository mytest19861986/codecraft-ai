import { z } from "zod";

const iranianMobileRegex = /^09\d{9}$/;

function normalizeLocalizedDigits(value: string) {
  return value.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (digit) => {
    const charCode = digit.charCodeAt(0);

    return String(charCode >= 0x06f0 ? charCode - 0x06f0 : charCode - 0x0660);
  });
}

function normalizeDigits(value: string) {
  return normalizeLocalizedDigits(value).replace(/\D/g, "").slice(0, 11);
}

const phoneSchema = z
  .string()
  .transform(normalizeDigits)
  .pipe(
    z
      .string()
      .length(11, "INVALID_PHONE")
      .refine((value) => iranianMobileRegex.test(value), "INVALID_PHONE")
  );

const passwordSchema = z.string().min(8).max(128);

export const studentRegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  password: passwordSchema
});

export const studentLoginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema
});

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;

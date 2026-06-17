import { z } from "zod";

const iranianMobileRegex = /^09\d{9}$/;

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => iranianMobileRegex.test(value), "INVALID_PHONE");

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

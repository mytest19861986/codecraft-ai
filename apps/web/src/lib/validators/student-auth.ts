import { z } from "zod";

const iranianMobileRegex = /^09\d{9}$/;
const nationalIdRegex = /^\d{10}$/;

const phoneSchema = z
  .string()
  .length(11, "INVALID_PHONE")
  .refine((value) => iranianMobileRegex.test(value), "INVALID_PHONE");

const nationalIdSchema = z
  .string()
  .length(10, "INVALID_NATIONAL_ID")
  .refine((value) => nationalIdRegex.test(value), "INVALID_NATIONAL_ID")
  .optional();

const passwordSchema = z.string().min(8).max(128);

export const studentRegisterSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  nationalId: nationalIdSchema,
  password: passwordSchema
});

export const studentLoginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema
});

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;

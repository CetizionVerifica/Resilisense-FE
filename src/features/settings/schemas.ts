import { z } from 'zod';
import { newPassword } from '@/features/auth/schemas';

/** Mirrors `PATCH /v1/me` (M01 §4.1 profile); the API validates again. */
export const profileSchema = z.object({
  name: z.string().trim().min(1, 'validation.required').max(120),
  jobTitle: z.string().trim().max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?[0-9 ()-]{4,32})?$/, 'settings:profile.phoneInvalid'),
  locale: z.string().min(1),
  timezone: z.string().min(1).max(64),
  theme: z.enum(['system', 'light', 'dark']),
});
export type ProfileValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1, 'validation.required'), newPassword, confirm: z.string() })
  .refine((v) => v.newPassword === v.confirm, { path: ['confirm'], message: 'auth:password.mismatch' });
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
  password: z.string().min(1, 'validation.required'),
});
export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export const disableMfaSchema = z.object({
  password: z.string().min(1, 'validation.required'),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'auth:mfa.codeInvalid'),
});
export type DisableMfaValues = z.infer<typeof disableMfaSchema>;

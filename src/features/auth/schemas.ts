import { z } from 'zod';

/** Client-side checks mirror the API contract; the server policy (zxcvbn, breached list) is authoritative. */
export const MIN_PASSWORD = 12;

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
  password: z.string().min(1, 'validation.required'),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const mfaSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'auth:mfa.codeInvalid'),
});
export type MfaValues = z.infer<typeof mfaSchema>;

export const recoverySchema = z.object({
  recoveryCode: z.string().trim().min(10, 'validation.required').max(32),
});
export type RecoveryValues = z.infer<typeof recoverySchema>;

export const emailSchema = z.object({
  email: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
});
export type EmailValues = z.infer<typeof emailSchema>;

const newPassword = z.string().min(MIN_PASSWORD, 'auth:password.tooShort').max(256);

export const resetSchema = z
  .object({ password: newPassword, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'auth:password.mismatch' });
export type ResetValues = z.infer<typeof resetSchema>;

export const acceptNewUserSchema = z.object({
  name: z.string().trim().min(1, 'validation.required').max(120),
  password: newPassword,
});
export type AcceptNewUserValues = z.infer<typeof acceptNewUserSchema>;

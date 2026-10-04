import { z } from 'zod';

/** Workspace profile & branding form (M02 §4.1 settings). */
export const workspaceSchema = z.object({
  name: z.string().trim().min(1, 'validation.required').max(120, 'companies:validation.tooLong'),
  country: z.string(),
  defaultLocale: z.string().min(1, 'validation.required'),
  timezone: z.string().min(1, 'validation.required'),
  accentColor: z
    .string()
    .trim()
    .refine((v) => v === '' || /^#[0-9A-Fa-f]{6}$/.test(v), 'workspace:validation.color'),
  reportFooter: z.string().trim().max(500, 'companies:validation.tooLong'),
});
export type WorkspaceValues = z.infer<typeof workspaceSchema>;

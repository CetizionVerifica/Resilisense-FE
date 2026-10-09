import { z } from 'zod';
import { type PartnerControllerCreateBody } from '@/api/generated/model';
import { companySchema, toCreateBody } from '@/features/companies';

/** Onboard a client (M02 US-02-1): workspace, first company, owner email (no password). */
export const clientSchema = companySchema.extend({
  workspaceName: z.string().trim().min(1, 'validation.required').max(120, 'companies:validation.tooLong'),
  workspaceCountry: z.string().regex(/^[A-Z]{2}$/, 'validation.required'),
  ownerEmail: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
});
export type ClientValues = z.infer<typeof clientSchema>;

export function toClientBody(v: ClientValues): PartnerControllerCreateBody {
  const { parentCompanyId: _parent, ...company } = toCreateBody(v);
  return {
    workspace: {
      name: v.workspaceName.trim(),
      country: v.workspaceCountry,
      // Defaults (M02 §4.2); the client's owner can change them in workspace settings.
      defaultLocale: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      dataRegion: 'eu',
    },
    company,
    owner: { email: v.ownerEmail.trim().toLowerCase() },
  };
}

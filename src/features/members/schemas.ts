import { z } from 'zod';
import { MEMBER_ROLES } from './roles';

/** Max invitations per request (M01 §7.1 bulk CSV limit; `POST …/invitations` maxItems). */
export const MAX_INVITES = 200;
const EMAIL = z.email();

/** Splits a pasted list on commas, semicolons, whitespace and newlines; de-duplicates case-insensitively. */
export function parseEmailList(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split(/[\s,;]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e && !seen.has(e) && seen.add(e));
}

export const inviteSchema = z.object({
  emails: z.string().superRefine((raw, ctx) => {
    const emails = parseEmailList(raw);
    if (emails.length === 0) ctx.addIssue({ code: 'custom', message: 'validation.required' });
    else if (emails.length > MAX_INVITES) ctx.addIssue({ code: 'custom', message: 'members:invite.tooMany' });
    else if (emails.some((e) => !EMAIL.safeParse(e).success)) {
      ctx.addIssue({ code: 'custom', message: 'members:invite.invalidEmails' });
    }
  }),
  role: z.enum(MEMBER_ROLES),
});
export type InviteValues = z.infer<typeof inviteSchema>;

export const CSV_HEADER = 'email,role,company_ids,project_ids';

/** Data rows in a CSV (header excluded, blank lines ignored) — for the client-side 200-row check only. */
export function csvRowCount(csv: string): number {
  return Math.max(0, csv.split(/\r?\n/).filter((l) => l.trim()).length - 1);
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Download, Info, UserCheck } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { membersControllerInvite, membersControllerInviteCsv } from '@/api/generated/members/members';
import { type MembersControllerInvite201ResultsItem } from '@/api/generated/model';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { isApiError } from '@/lib/problem';
import { useInvalidateMembers } from '../hooks';
import { memberProblem } from '../problem-message';
import { type MemberRole } from '../roles';
import { CSV_HEADER, csvRowCount, type InviteValues, inviteSchema, MAX_INVITES, parseEmailList } from '../schemas';

type Result = MembersControllerInvite201ResultsItem;

const TEMPLATE_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(`${CSV_HEADER}\nname@example.com,contributor,,\n`)}`;

/**
 * Invite people (M01 §4.1, US-01-1): by email list or CSV upload (header
 * `email,role,company_ids,project_ids`, ≤ 200 rows). Each submission carries a fresh
 * `Idempotency-Key`.
 */
export function InviteSheet({
  wid,
  open,
  onOpenChange,
  grantable,
}: {
  wid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grantable: MemberRole[];
}) {
  const { t } = useTranslation('members');
  const [results, setResults] = useState<Result[] | null>(null);
  const [tab, setTab] = useState('email');
  const invalidate = useInvalidateMembers(wid);
  const done = (r: Result[]) => {
    setResults(r);
    void invalidate();
  };

  // Every close path (X, Esc, overlay, Cancel, Done) goes through here so the next open shows the form.
  const setOpen = (o: boolean) => {
    if (!o) setResults(null);
    onOpenChange(o);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent closeLabel={t('common:action.close')}>
        <SheetHeader>
          <SheetTitle>{t('invite.title')}</SheetTitle>
          <SheetDescription>{t('invite.description')}</SheetDescription>
        </SheetHeader>
        {results ? (
          <InviteResults results={results} onMore={() => setResults(null)} onClose={() => setOpen(false)} />
        ) : (
          <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
            <TabsList className="px-5">
              <TabsTrigger value="email">{t('invite.byEmail')}</TabsTrigger>
              <TabsTrigger value="csv">{t('invite.byCsv')}</TabsTrigger>
            </TabsList>
            <TabsContent value="email" className="flex flex-1 flex-col pt-0">
              <EmailInviteForm wid={wid} grantable={grantable} onDone={done} onCancel={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="csv" className="flex flex-1 flex-col pt-0">
              <CsvInviteForm wid={wid} onDone={done} onCancel={() => setOpen(false)} />
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ScopeNote() {
  const { t } = useTranslation('members');
  return (
    <p className="flex gap-2 text-small text-fg-muted">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      {t('invite.scopeNote')}
    </p>
  );
}

function EmailInviteForm({
  wid,
  grantable,
  onDone,
  onCancel,
}: {
  wid: string;
  grantable: MemberRole[];
  onDone: (r: Result[]) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('members');
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { emails: '', role: grantable.includes('contributor') ? 'contributor' : grantable[0] },
  });
  const invite = useMutation({
    mutationFn: (v: InviteValues) =>
      membersControllerInvite(
        wid,
        {
          invitations: parseEmailList(v.emails).map((email) => ({
            email,
            role: v.role,
            companyIds: [],
            projectIds: [],
          })),
        },
        { headers: { 'Idempotency-Key': crypto.randomUUID() } },
      ),
    onSuccess: (res) => onDone(res.results),
    onError: (e) => {
      if (isApiError(e, 'validation_failed')) {
        form.setError('emails', { type: 'server', message: 'members:invite.invalidEmails' });
      }
    },
  });
  const { errors } = form.formState;
  const [emails, role] = useWatch({ control: form.control, name: ['emails', 'role'] });
  const count = parseEmailList(emails).length;

  return (
    <form noValidate className="flex flex-1 flex-col" onSubmit={form.handleSubmit((v) => invite.mutate(v))}>
      <SheetBody>
        {invite.error && !isApiError(invite.error, 'validation_failed') ? (
          <Alert tone="danger">{memberProblem(t, invite.error)}</Alert>
        ) : null}
        <FormField
          label={t('invite.emails')}
          hint={t('invite.emailsHint', { max: MAX_INVITES })}
          error={errors.emails?.message && t(errors.emails.message, { max: MAX_INVITES })}
        >
          <Textarea rows={5} autoFocus dir="ltr" {...form.register('emails')} />
        </FormField>
        <FormField label={t('column.role')} error={errors.role?.message && t(errors.role.message)}>
          <Select {...form.register('role')}>
            {grantable.map((r) => (
              <option key={r} value={r}>
                {t(`common:role.${r}`)}
              </option>
            ))}
          </Select>
        </FormField>
        <p className="text-small text-fg-muted">{t(`roleHelp.${role}`)}</p>
        <ScopeNote />
      </SheetBody>
      <SheetFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common:action.cancel')}
        </Button>
        <Button type="submit" loading={invite.isPending}>
          {t('invite.send', { count })}
        </Button>
      </SheetFooter>
    </form>
  );
}

function CsvInviteForm({
  wid,
  onDone,
  onCancel,
}: {
  wid: string;
  onDone: (r: Result[]) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('members');
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const upload = useMutation({
    mutationFn: (text: string) =>
      membersControllerInviteCsv(wid, { csv: text }, { headers: { 'Idempotency-Key': crypto.randomUUID() } }),
    onSuccess: (res) => onDone(res.results),
  });
  const lineErrors =
    isApiError(upload.error, 'validation_failed') && upload.error.problem.errors
      ? upload.error.problem.errors.map((e) => ({ line: e.path.replace(/^csv:/, ''), message: e.message }))
      : null;

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setCsv(await file.text());
    setClientError(null);
    upload.reset();
  };

  const submit = () => {
    if (!csv.trim()) return setClientError(t('csv.required'));
    if (csvRowCount(csv) > MAX_INVITES) return setClientError(t('invite.tooMany', { max: MAX_INVITES }));
    setClientError(null);
    upload.mutate(csv);
  };

  return (
    <form
      noValidate
      className="flex flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <SheetBody>
        <p className="text-body text-fg-muted">{t('csv.description', { max: MAX_INVITES })}</p>
        <code className="rounded-sm bg-subtle p-2 font-mono text-small" dir="ltr">
          {CSV_HEADER}
        </code>
        <a
          href={TEMPLATE_HREF}
          download="resilisense-invitations.csv"
          className="inline-flex items-center gap-1.5 justify-self-start text-body text-link hover:underline"
        >
          <Download className="size-4" aria-hidden />
          {t('csv.template')}
        </a>
        <FormField label={t('csv.file')} hint={fileName ?? undefined} error={clientError ?? undefined}>
          <Input type="file" accept=".csv,text/csv" className="h-auto py-1.5" onChange={(e) => void onFile(e)} />
        </FormField>
        {lineErrors ? (
          <Alert tone="danger">
            <p className="font-medium">{t('csv.invalid')}</p>
            <ul className="list-disc ps-5">
              {lineErrors.map((e) => (
                <li key={`${e.line}-${e.message}`}>{t('csv.lineError', { line: e.line, message: e.message })}</li>
              ))}
            </ul>
          </Alert>
        ) : upload.error ? (
          <Alert tone="danger">{memberProblem(t, upload.error)}</Alert>
        ) : null}
        <ScopeNote />
      </SheetBody>
      <SheetFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common:action.cancel')}
        </Button>
        <Button type="submit" loading={upload.isPending}>
          {t('csv.submit')}
        </Button>
      </SheetFooter>
    </form>
  );
}

function InviteResults({ results, onMore, onClose }: { results: Result[]; onMore: () => void; onClose: () => void }) {
  const { t } = useTranslation('members');
  const invited = results.filter((r) => r.status === 'invited').length;
  return (
    <>
      <SheetBody>
        <Alert tone="success">{t('results.summary', { invited, skipped: results.length - invited })}</Alert>
        <ul className="divide-y divide-border rounded-sm border border-border" aria-label={t('results.title')}>
          {results.map((r) => (
            <li key={r.email} className="flex items-center gap-3 p-3 text-body">
              {r.status === 'invited' ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <UserCheck className="size-4 shrink-0 text-fg-muted" aria-hidden />
              )}
              <span className="min-w-0 flex-1 truncate">{r.email}</span>
              <span className="text-small text-fg-muted">{t(`results.${r.status}`)}</span>
            </li>
          ))}
        </ul>
      </SheetBody>
      <SheetFooter>
        <Button variant="secondary" onClick={onMore}>
          {t('results.more')}
        </Button>
        <Button onClick={onClose}>{t('results.done')}</Button>
      </SheetFooter>
    </>
  );
}

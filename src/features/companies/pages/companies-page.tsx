import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceReadOnly } from '@/lib/auth/entitlements';
import { usePermission } from '@/lib/auth/me';
import { CompaniesTable, DeletedCompaniesTable } from '../components/companies-table';
import { CreateCompanySheet } from '../components/create-company-sheet';

/**
 * `/companies` (M02 §9, US-02-4): reporting companies of the workspace. Search, view and the
 * create sheet live in the URL (`?q=`, `?view=deleted`, `?new=1`).
 */
export function CompaniesPage() {
  const { t } = useTranslation('companies');
  const [params, setParams] = useSearchParams();
  const readOnly = useWorkspaceReadOnly();
  const canCreate = usePermission('company:create') && !readOnly;
  const canUpdate = usePermission('company:update');
  const q = params.get('q') ?? '';
  const [draft, setDraft] = useState(q);
  const view = canUpdate && params.get('view') === 'deleted' ? 'deleted' : 'active';

  const update = (changes: Record<string, string | undefined>) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [k, v] of Object.entries(changes)) {
          if (v) next.set(k, v);
          else next.delete(k);
        }
        return next;
      },
      { replace: true },
    );

  // Debounced search into the URL.
  useEffect(() => {
    if (draft.trim() === q) return;
    const id = setTimeout(() => update({ q: draft.trim() || undefined }), 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the draft drives the debounce
  }, [draft]);

  const openCreate = canCreate ? () => update({ new: '1' }) : undefined;
  const active = (
    <div className="grid gap-4">
      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted"
          aria-hidden
        />
        <Input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.label')}
          className="ps-9"
        />
      </div>
      <CompaniesTable
        q={q}
        onCreate={openCreate}
        onClearSearch={() => {
          setDraft('');
          update({ q: undefined });
        }}
      />
    </div>
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          openCreate ? (
            <Button onClick={openCreate}>
              <Plus aria-hidden />
              {t('create.open')}
            </Button>
          ) : null
        }
      />
      {canUpdate ? (
        <Tabs value={view} onValueChange={(v) => update({ view: v === 'deleted' ? v : undefined })}>
          <TabsList>
            <TabsTrigger value="active">{t('table.active')}</TabsTrigger>
            <TabsTrigger value="deleted">{t('table.deleted')}</TabsTrigger>
          </TabsList>
          <TabsContent value="active">{active}</TabsContent>
          <TabsContent value="deleted">
            <DeletedCompaniesTable />
          </TabsContent>
        </Tabs>
      ) : (
        active
      )}
      {canCreate ? (
        <CreateCompanySheet
          open={params.get('new') === '1'}
          onOpenChange={(o) => update({ new: o ? '1' : undefined })}
        />
      ) : null}
    </>
  );
}

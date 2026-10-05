import { ChevronsUpDown, Factory } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCompanies } from '@/features/companies/hooks';
import { useCompanyContext } from '@/lib/company-context';

const ALL = 'all';
/** Enough for the switcher; workspaces with more companies use the Companies page search. */
const SWITCHER_LIMIT = 100;

/** Top-bar company context (M02 US-02-4); only shown once the workspace has two or more companies. */
export function CompanySwitcher() {
  const { t } = useTranslation();
  const { companyId, setCompanyId } = useCompanyContext();
  const { items } = useCompanies({}, SWITCHER_LIMIT);
  if (items.length < 2) return null;
  const current = items.find((c) => c.id === companyId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden max-w-56 justify-start px-2 sm:inline-flex"
          aria-label={t('company.switch')}
        >
          <Factory aria-hidden />
          <span className="truncate">{current?.displayName ?? t('company.all')}</span>
          <ChevronsUpDown className="ms-auto text-fg-muted" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>{t('company.label')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={current?.id ?? ALL} onValueChange={(v) => setCompanyId(v === ALL ? null : v)}>
          <DropdownMenuRadioItem value={ALL}>{t('company.all')}</DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {items.map((c) => (
            <DropdownMenuRadioItem key={c.id} value={c.id}>
              <span className="truncate">{c.displayName}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

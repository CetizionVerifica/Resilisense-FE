import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReferenceControllerCountries, useReferenceControllerSectors } from '@/api/generated/reference/reference';
import { type ReferenceControllerSectors200ItemsItem } from '@/api/generated/model';

/** Reference lists change only with a deploy (M02 §8: cacheable). */
const STATIC = { staleTime: Infinity, gcTime: Infinity } as const;

export type Sector = ReferenceControllerSectors200ItemsItem;

export function useSectors() {
  const query = useReferenceControllerSectors({ query: STATIC });
  const byCode = useMemo(() => new Map((query.data?.items ?? []).map((s) => [s.code, s])), [query.data]);
  /** Sector groups with their types, in API order (two-level legacy list). */
  const groups = useMemo(() => {
    const items = query.data?.items ?? [];
    return items
      .filter((s) => !s.parentCode)
      .map((group) => ({ group, items: items.filter((s) => s.parentCode === group.code) }));
  }, [query.data]);
  return { ...query, byCode, groups };
}

export function useCountries() {
  return useReferenceControllerCountries({ query: STATIC });
}

/** Localised country / currency names through Intl (02 §7), never hand-written lists. */
export function useDisplayNames() {
  const { i18n } = useTranslation();
  return useMemo(() => {
    const region = new Intl.DisplayNames([i18n.language], { type: 'region', fallback: 'code' });
    const currency = new Intl.DisplayNames([i18n.language], { type: 'currency', fallback: 'code' });
    const month = new Intl.DateTimeFormat(i18n.language, { month: 'long', timeZone: 'UTC' });
    return {
      country: (code: string | null | undefined) => (code ? (region.of(code) ?? code) : ''),
      currency: (code: string) => currency.of(code) ?? code,
      month: (m: number) => month.format(new Date(Date.UTC(2026, m - 1, 1))),
    };
  }, [i18n.language]);
}

/** ISO 4217 codes the browser knows, sorted. */
export function currencyCodes(): string[] {
  return typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('currency')
    : ['EUR', 'USD', 'INR', 'GBP'];
}

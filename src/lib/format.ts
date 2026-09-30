/**
 * Locale-aware date formatting (02 §7): relative for recent activity ("2 hours ago"), absolute
 * (`30 Sep 2026`) in tables. Always through Intl, never hand-built strings.
 */
const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
];

export function formatRelative(iso: string, locale: string, now: Date = new Date()): string {
  const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, 'minute');
}

export function formatDate(iso: string, locale: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', ...(timeZone ? { timeZone } : {}) }).format(
    new Date(iso),
  );
}

/** Coarse browser/OS names from a User-Agent, for the sessions list only (never for logic). */
export function describeUserAgent(ua: string): { browser?: string; os?: string } {
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /Firefox\//.test(ua)
      ? 'Firefox'
      : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Safari\//.test(ua)
          ? 'Safari'
          : undefined;
  const os = /iPhone|iPad/.test(ua)
    ? 'iOS'
    : /Android/.test(ua)
      ? 'Android'
      : /Windows/.test(ua)
        ? 'Windows'
        : /Mac OS X|Macintosh/.test(ua)
          ? 'macOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : undefined;
  return { ...(browser ? { browser } : {}), ...(os ? { os } : {}) };
}

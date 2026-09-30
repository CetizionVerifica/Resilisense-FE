import i18n from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';
import enAuth from '@/locales/en/auth.json';
import enCommon from '@/locales/en/common.json';
import enMembers from '@/locales/en/members.json';
import enSettings from '@/locales/en/settings.json';
import { pseudoLocalizeTree } from './pseudo-locale';

/**
 * UI strings (M15 §2): i18next + ICU, namespaces per feature. Launch locales are an open question
 * (M15 §5); `en` is the source, `en-XA` is the pseudo-locale for expansion/encoding checks.
 */
export const SOURCE_LOCALE = 'en';
export const PSEUDO_LOCALE = 'en-XA';
export const SUPPORTED_LOCALES = [SOURCE_LOCALE, ...(import.meta.env.PROD ? [] : [PSEUDO_LOCALE])];
const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

export const resources = {
  en: { common: enCommon, auth: enAuth, settings: enSettings, members: enMembers },
  [PSEUDO_LOCALE]: {
    common: pseudoLocalizeTree(enCommon),
    auth: pseudoLocalizeTree(enAuth),
    settings: pseudoLocalizeTree(enSettings),
    members: pseudoLocalizeTree(enMembers),
  },
} as const;

export function directionOf(locale: string): 'ltr' | 'rtl' {
  return RTL_LANGUAGES.has(locale.split('-')[0] ?? '') ? 'rtl' : 'ltr';
}

/** Browser preference → supported locale; the user's profile locale overrides it after sign-in. */
export function detectLocale(preferred: readonly string[] = navigator.languages): string {
  for (const tag of preferred) {
    const match = SUPPORTED_LOCALES.find((l) => l === tag) ?? SUPPORTED_LOCALES.find((l) => l === tag.split('-')[0]);
    if (match) return match;
  }
  return SOURCE_LOCALE;
}

function applyDocumentLocale(locale: string): void {
  document.documentElement.lang = locale;
  document.documentElement.dir = directionOf(locale);
}

export async function initI18n(locale = detectLocale()): Promise<typeof i18n> {
  if (!i18n.isInitialized) {
    i18n.on('languageChanged', applyDocumentLocale);
    await i18n
      .use(ICU)
      .use(initReactI18next)
      .init({
        resources,
        lng: locale,
        fallbackLng: SOURCE_LOCALE,
        supportedLngs: [...SUPPORTED_LOCALES],
        ns: ['common', 'auth', 'settings', 'members'],
        defaultNS: 'common',
        fallbackNS: 'common',
        interpolation: { escapeValue: false }, // React escapes
        returnNull: false,
      });
    applyDocumentLocale(i18n.language);
  }
  return i18n;
}

export { i18n };

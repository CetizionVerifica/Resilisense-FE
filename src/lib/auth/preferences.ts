import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMeControllerGetQueryKey, useMeControllerUpdate } from '@/api/generated/me/me';
import { type MeControllerGet200 } from '@/api/generated/model';
import { SUPPORTED_LOCALES } from '../i18n';
import { type ThemePreference, useTheme } from '../theme';
import { useMe } from './me';

/**
 * Applies the signed-in user's saved theme and language (M01 §4.1 profile, M15): the profile wins
 * over the browser default once `/me` has loaded. Mounted once in the app shell.
 */
export function useApplyProfilePreferences(): void {
  const { data: me } = useMe();
  const { setPreference } = useTheme();
  const { i18n } = useTranslation();
  const theme = me?.user.theme;
  const locale = me?.user.locale;

  useEffect(() => {
    if (theme) setPreference(theme);
  }, [theme, setPreference]);

  useEffect(() => {
    if (locale && locale !== i18n.language && SUPPORTED_LOCALES.includes(locale)) void i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

/** `PATCH /v1/me` that also refreshes the cached `/me` user, so every consumer sees the change. */
export function useUpdateProfile(options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) {
  const queryClient = useQueryClient();
  return useMeControllerUpdate({
    mutation: {
      onSuccess: (user) => {
        queryClient.setQueryData<MeControllerGet200>(getMeControllerGetQueryKey(), (me) => (me ? { ...me, user } : me));
        options?.onSuccess?.();
      },
      onError: (e) => options?.onError?.(e),
    },
  });
}

/** Theme / language quick switches (user menu) that persist to the profile. */
export function useQuickPreferences() {
  const { setPreference } = useTheme();
  const { i18n } = useTranslation();
  const update = useUpdateProfile();
  return {
    setTheme: (theme: ThemePreference) => {
      setPreference(theme);
      update.mutate({ data: { theme } });
    },
    setLocale: (locale: string) => {
      void i18n.changeLanguage(locale);
      update.mutate({ data: { locale } });
    },
  };
}

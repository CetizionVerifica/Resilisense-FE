import { QueryClientProvider } from '@tanstack/react-query';
import { Direction } from 'radix-ui';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { directionOf } from '@/lib/i18n';
import { createQueryClient } from '@/lib/query-client';
import { ThemeProvider, useTheme } from '@/lib/theme';

function ThemedToaster() {
  const { resolved } = useTheme();
  return <Toaster theme={resolved} position="bottom-right" richColors closeButton />;
}

/** Radix primitives (tabs, menus) read direction from context, not from `<html dir>` (02 §8 RTL). */
function LocaleDirection({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  return <Direction.Provider dir={directionOf(i18n.language)}>{children}</Direction.Provider>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <LocaleDirection>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <ThemedToaster />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </LocaleDirection>
  );
}

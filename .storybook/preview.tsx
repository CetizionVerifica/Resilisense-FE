import type { Decorator, Preview } from '@storybook/react-vite';
import { type ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n, initI18n } from '../src/lib/i18n';
import '../src/styles/index.css';

await initI18n('en');

interface Globals {
  theme: string;
  direction: 'ltr' | 'rtl';
  locale: string;
}

function GlobalsFrame({ globals, children }: { globals: Globals; children: ReactNode }) {
  const { theme, direction, locale } = globals;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    void i18n.changeLanguage(locale).then(() => {
      document.documentElement.dir = direction;
    });
  }, [theme, direction, locale]);
  return (
    <I18nextProvider i18n={i18n}>
      <div className="bg-canvas p-6 text-fg">{children}</div>
    </I18nextProvider>
  );
}

const withGlobals: Decorator = (Story, context) => (
  <GlobalsFrame globals={context.globals as Globals}>
    <Story />
  </GlobalsFrame>
);

const preview: Preview = {
  decorators: [withGlobals],
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
    direction: {
      description: 'Text direction',
      toolbar: { title: 'Direction', icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true },
    },
    locale: {
      description: 'Locale',
      toolbar: { title: 'Locale', icon: 'globe', items: ['en', 'en-XA'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light', direction: 'ltr', locale: 'en' },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;

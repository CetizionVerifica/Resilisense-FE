import { render, screen } from '@testing-library/react';
import { AppProviders } from '@/app/providers';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type * as I18n from '@/lib/i18n';

// No RTL locale ships yet (M15 §5), so force the direction the provider derives from the locale.
vi.mock('@/lib/i18n', async (importOriginal) => ({
  ...(await importOriginal<typeof I18n>()),
  directionOf: () => 'rtl' as const,
}));

describe('RTL direction for Radix primitives (02 §8)', () => {
  it('passes the locale direction to Radix (it ignores <html dir>)', () => {
    render(
      <AppProviders>
        <Tabs defaultValue="a">
          <TabsList aria-label="tabs">
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
        </Tabs>
      </AppProviders>,
    );
    // Radix sets `dir` on the Tabs root; keyboard arrows and layout follow it
    expect(screen.getByRole('tablist', { name: 'tabs' }).parentElement).toHaveAttribute('dir', 'rtl');
  });
});

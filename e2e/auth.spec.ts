import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, signIn } from './support';

test.describe('M01 journeys', () => {
  test('sign in → home → switch workspace → sign out', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/sign-in$/);
    await expectNoA11yViolations(page);

    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Switch workspace' }).click();
    await page.getByRole('menuitemradio', { name: /Beta Foods/ }).click();
    await expect(page.getByRole('button', { name: 'Switch workspace' })).toContainText('Beta Foods');

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('two-factor challenge', async ({ page }) => {
    await signIn(page, 'mfa@example.com');
    await expect(page.getByRole('heading', { name: 'Two-factor authentication' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByLabel('Authentication code').fill('123456');
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, Mia Factor' })).toBeVisible();
  });

  test('forgot password shows the generic confirmation', async ({ page }) => {
    await page.goto('/forgot-password');
    await expectNoA11yViolations(page);
    await page.getByLabel('Email').fill('someone@example.com');
    await page.getByRole('button', { name: 'Send reset link' }).click();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  });

  test('reset password and accept invitation pages are accessible', async ({ page }) => {
    await page.goto('/reset-password/reset-token-valid-0123456789');
    await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.goto('/accept-invite/invite-token-valid-0123456789');
    await expect(page.getByRole('heading', { name: 'Join your team on ResiliSense' })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('command palette opens with the keyboard', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('unknown routes render the 404 page', async ({ page }) => {
    await page.goto('/nope/nothing-here');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

test.describe('themes & locales', () => {
  test.use({ colorScheme: 'dark' });

  test('dark mode (OS preference) passes axe on sign-in and home', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectNoA11yViolations(page);
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

test.describe('pseudo-locale', () => {
  test.use({ locale: 'en-XA' });

  test('every visible sign-in string is translated (M15 §4)', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-XA');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^\[Š/);
    // Any untranslated English (no pseudo brackets) in the form would show here.
    const labels = await page.locator('form label, form button').allTextContents();
    expect(labels.filter((l) => l.trim() && !l.trim().startsWith('['))).toEqual([]);
  });
});

test.describe('right-to-left', () => {
  test('the shell mirrors with dir="rtl" (logical properties)', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await page.evaluate(() => document.documentElement.setAttribute('dir', 'rtl'));
    const nav = await page.getByRole('navigation', { name: 'Main navigation' }).boundingBox();
    const viewport = page.viewportSize()!;
    expect(nav!.x + nav!.width).toBeGreaterThan(viewport.width - 5); // sidebar on the right
    await expectNoA11yViolations(page);
  });
});

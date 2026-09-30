import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** WCAG 2.2 AA axe scan (02 §8: zero violations). */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

export const PASSWORD = 'correct horse battery staple';

export async function signIn(page: Page, email = 'alice@example.com'): Promise<void> {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

/** Client-side navigation to settings (a full reload would drop the in-memory session and MSW state). */
export async function openSettings(page: Page, tab: 'Profile' | 'Security' | 'Members' = 'Profile'): Promise<void> {
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menuitem', { name: 'Account settings' }).click();
  await page.getByRole('navigation', { name: 'Settings sections' }).getByRole('link', { name: tab }).click();
}

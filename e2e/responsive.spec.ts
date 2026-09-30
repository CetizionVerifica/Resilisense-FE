import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, signIn } from './support';

test('mobile: sidebar becomes a sheet; no horizontal scroll at phone width', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Home' })).toBeVisible();
  await expectNoA11yViolations(page);
});

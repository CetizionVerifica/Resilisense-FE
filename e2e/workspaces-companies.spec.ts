import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, openNav, openSettings, signIn } from './support';

test.describe('M02 workspaces & companies', () => {
  test('add a subsidiary → switch company context → edit → delete → restore (US-02-4)', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await openNav(page, 'Companies');
    await expect(page.getByRole('table', { name: 'Active' }).getByText('Acme Industries GmbH')).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Add company' }).first().click();
    const sheet = page.getByRole('dialog', { name: 'Add a company' });
    await expect(sheet).toBeVisible();
    await expectNoA11yViolations(page);
    await sheet.getByLabel('Legal name').fill('Acme Nord AB');
    await sheet.getByLabel('Country').selectOption('FR');
    await sheet.getByLabel('Sector').selectOption('logistics');
    await sheet.getByLabel('Size').selectOption('small');
    await sheet.getByLabel('Reporting currency').selectOption('EUR');
    await sheet.getByLabel('Parent company').selectOption({ label: 'Acme Industries' });
    await sheet.getByRole('button', { name: 'Add company' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Acme Nord AB' })).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Switch company' }).click();
    await page.getByRole('menuitemradio', { name: 'Acme Nord AB' }).click();
    await expect(page.getByRole('button', { name: 'Switch company' })).toContainText('Acme Nord AB');

    await page.getByRole('navigation', { name: 'Company sections' }).getByRole('link', { name: 'Settings' }).click();
    await page.getByLabel('Employees').fill('42');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Acme Nord AB was saved')).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Delete company' }).click();
    const dialog = page.getByRole('dialog', { name: 'Delete Acme Nord AB?' });
    await dialog.getByLabel('Type Acme Nord AB to confirm').fill('Acme Nord AB');
    await expectNoA11yViolations(page);
    await dialog.getByRole('button', { name: 'Delete company' }).click();
    await expect(page).toHaveURL(/\/companies$/);

    await page.getByRole('tab', { name: 'Recently deleted' }).click();
    await page.getByRole('button', { name: 'Restore Acme Nord AB' }).click();
    await expect(page.getByText('Acme Nord AB was restored')).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('workspace settings and plan are readable and accessible', async ({ page }) => {
    await signIn(page);
    await openSettings(page, 'Workspace');
    await expect(page.getByLabel('Workspace name')).toHaveValue('Acme Industries');
    await expectNoA11yViolations(page);
    await page.getByRole('navigation', { name: 'Settings sections' }).getByRole('link', { name: 'Plan' }).click();
    await expect(page.getByRole('meter', { name: 'Companies' })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test('a partner onboards a client and opens its workspace (US-02-1)', async ({ page }) => {
    await signIn(page, 'partner@example.com');
    await openNav(page, 'Clients');
    await expect(page.getByRole('table', { name: 'Client workspaces' })).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Onboard client' }).click();
    const sheet = page.getByRole('dialog', { name: 'Onboard a client' });
    await sheet.getByLabel('Workspace name').fill('Sole Textiles');
    await sheet.getByLabel('Workspace country').selectOption('IN');
    await sheet.getByLabel('Owner email').fill('ravi@sole.example');
    await sheet.getByLabel('Legal name').fill('Sole Textiles Pvt Ltd');
    await sheet.getByLabel('Country', { exact: true }).selectOption('IN');
    await sheet.getByLabel('Sector').selectOption('chemicals');
    await sheet.getByLabel('Size').selectOption('medium');
    await sheet.getByLabel('Reporting currency').selectOption('INR');
    await expectNoA11yViolations(page);
    await sheet.getByRole('button', { name: 'Create workspace' }).click();
    await expect(page.getByRole('table', { name: 'Client workspaces' }).getByText('Sole Textiles')).toBeVisible();

    await page.getByRole('button', { name: 'Open Nordwind Logistics' }).click();
    await expect(page.getByRole('button', { name: 'Switch workspace' })).toContainText('Nordwind Logistics');
  });

  test('a suspended workspace shows the notice and stays read-only (US-02-5)', async ({ page }) => {
    await signIn(page, 'suspended@example.com');
    await expect(page.getByText(/Halted Holdings is suspended/)).toBeVisible();
    await openNav(page, 'Companies');
    await expect(page.getByRole('table', { name: 'Active' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add company' })).toHaveCount(0);
    await expectNoA11yViolations(page);
  });
});

test.describe('M02 in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('companies, company overview and plan pass axe in dark mode', async ({ page }) => {
    await signIn(page);
    await openNav(page, 'Companies');
    await expect(page.getByRole('table', { name: 'Active' }).getByText('Acme Industries GmbH')).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByRole('link', { name: 'Acme Industries', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Acme Industries' })).toBeVisible();
    await expectNoA11yViolations(page);
    await openSettings(page, 'Plan');
    await expect(page.getByRole('meter', { name: 'Companies' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, openSettings, PASSWORD, signIn } from './support';

test.describe('M01 members & invitations', () => {
  test('invite → accept → sign in → switch workspace → sign out (US-01-1, US-01-3)', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome, Alice Admin' })).toBeVisible();
    await openSettings(page, 'Members');
    await expect(page.getByRole('table', { name: 'Members' })).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Invite people' }).click();
    const sheet = page.getByRole('dialog', { name: 'Invite people' });
    await expect(sheet).toBeVisible();
    await expectNoA11yViolations(page);
    await sheet.getByLabel('Email addresses').fill('ivy@example.com');
    await sheet.getByLabel('Role').selectOption('contributor');
    await sheet.getByRole('button', { name: 'Send 1 invitation' }).click();
    await expect(sheet.getByText('1 invitation sent.')).toBeVisible();
    await sheet.getByRole('button', { name: 'Done' }).click();
    await page.getByRole('tab', { name: 'Pending invitations' }).click();
    await expect(page.getByRole('table', { name: 'Pending invitations' }).getByText('ivy@example.com')).toBeVisible();
    await expectNoA11yViolations(page);

    // The invitee opens the emailed link (MSW fixture token) and creates an account.
    await page.goto('/accept-invite/invite-token-valid-0123456789');
    await page.getByLabel('Full name').fill('Ivy Invitee');
    await page.getByLabel('New password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Create account and join' }).click();
    await expect(page.getByRole('heading', { name: "You're in" })).toBeVisible();

    await signIn(page);
    await page.getByRole('button', { name: 'Switch workspace' }).click();
    await page.getByRole('menuitemradio', { name: /Beta Foods/ }).click();
    await expect(page.getByRole('button', { name: 'Switch workspace' })).toContainText('Beta Foods');
    // viewer in Beta: no members tab
    await openSettings(page, 'Profile');
    await expect(
      page.getByRole('navigation', { name: 'Settings sections' }).getByRole('link', { name: 'Members' }),
    ).toHaveCount(0);

    await page.getByRole('button', { name: 'Account menu' }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('change a role and remove a member', async ({ page }) => {
    await signIn(page);
    await openSettings(page, 'Members');
    const carl = page.getByRole('row', { name: /Carl Contributor/ });
    await carl.getByRole('button', { name: 'Actions for Carl Contributor' }).click();
    await page.getByRole('menuitem', { name: 'Change role…' }).click();
    const dialog = page.getByRole('dialog', { name: 'Change role of Carl Contributor' });
    await dialog.getByLabel('Role').selectOption('viewer');
    await expectNoA11yViolations(page);
    await dialog.getByRole('button', { name: 'Change role' }).click();
    await expect(carl.getByText('Viewer')).toBeVisible();

    await carl.getByRole('button', { name: 'Actions for Carl Contributor' }).click();
    await page.getByRole('menuitem', { name: 'Remove from workspace' }).click();
    await page
      .getByRole('dialog', { name: 'Remove Carl Contributor from this workspace?' })
      .getByRole('button', { name: 'Remove' })
      .click();
    await expect(page.getByRole('row', { name: /Carl Contributor/ })).toHaveCount(0);
  });
});

test.describe('M01 self-service', () => {
  test('sign up → verify email', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByRole('link', { name: 'Start a free trial' }).click();
    await expect(page.getByRole('heading', { name: 'Start your free trial' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByLabel('Full name').fill('Sam Starter');
    await page.getByLabel('Work email').fill('sam@example.com');
    await page.getByLabel('New password').fill(PASSWORD);
    await page.getByLabel('Organisation name').fill('Starter Co');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();

    await page.goto('/verify-email/verify-token-valid-0123456789');
    await expectNoA11yViolations(page);
    await page.getByRole('button', { name: 'Confirm email address' }).click();
    await expect(page.getByRole('heading', { name: 'Email confirmed' })).toBeVisible();
  });

  test('profile and security pages pass axe; MFA setup; revoke a session', async ({ page }) => {
    await signIn(page);
    await openSettings(page, 'Profile');
    await expect(page.getByLabel('Full name')).toHaveValue('Alice Admin');
    await expectNoA11yViolations(page);

    await page.getByRole('navigation', { name: 'Settings sections' }).getByRole('link', { name: 'Security' }).click();
    await expect(page.getByRole('list', { name: "Where you're signed in" })).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole('button', { name: 'Set up two-factor authentication' }).click();
    await expect(page.getByText('JBSWY3DPEHPK3PXP')).toBeVisible();
    await page.getByLabel('Authentication code').fill('123456');
    await page.getByRole('button', { name: 'Turn on two-factor authentication' }).click();
    await expect(page.getByRole('list', { name: 'Save your recovery codes' })).toBeVisible();
    await page.getByRole('button', { name: 'I saved my codes' }).click();
    await expect(page.getByText('Two-factor authentication is on')).toBeVisible();

    const sessions = page.getByRole('list', { name: "Where you're signed in" });
    await sessions.getByRole('button', { name: 'Sign out Firefox on Windows' }).click();
    await page.getByRole('dialog', { name: 'Sign out this device?' }).getByRole('button', { name: 'Sign out' }).click();
    await expect(sessions.getByText('Firefox on Windows')).toHaveCount(0);
  });

  test('terms gate and impersonation banner pass axe', async ({ page }) => {
    await signIn(page, 'terms@example.com');
    await expect(page.getByRole('heading', { name: 'Review the updated terms' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Accept and continue' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, Terry Terms' })).toBeVisible();

    await signIn(page, 'impersonated@example.com');
    await expect(page.getByRole('button', { name: 'End impersonation' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByRole('button', { name: 'End impersonation' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome, Paula Platform' })).toBeVisible();
  });
});

test.describe('settings in dark mode', () => {
  test.use({ colorScheme: 'dark' });

  test('members page and invite sheet pass axe in dark mode', async ({ page }) => {
    await signIn(page);
    await openSettings(page, 'Members');
    await expect(page.getByRole('table', { name: 'Members' })).toBeVisible();
    await expectNoA11yViolations(page);
    await page.getByRole('button', { name: 'Invite people' }).click();
    await expect(page.getByRole('dialog', { name: 'Invite people' })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

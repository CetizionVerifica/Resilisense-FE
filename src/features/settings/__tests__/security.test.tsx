import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { MOCK_MFA_CODE, MOCK_PASSWORD } from '@/mocks/data';
import { renderSignedIn } from '@/test/session';
import { server } from '@/test/server';

describe('security settings (M01 §9)', () => {
  it('changes the password; a wrong current password is shown on its field', async () => {
    const { user } = await renderSignedIn('/settings/security');
    await screen.findByLabelText('New email address');
    await user.type(screen.getAllByLabelText('Current password')[0]!, 'nope');
    await user.type(screen.getAllByLabelText('New password')[0]!, 'a much longer new password');
    await user.type(screen.getByLabelText('Confirm password'), 'a much longer new password');
    await user.click(screen.getByRole('button', { name: 'Change password' }));
    const current = screen.getAllByLabelText('Current password')[0]!;
    await waitFor(() => expect(current).toHaveAccessibleDescription('The password is incorrect'));

    await user.clear(current);
    await user.type(current, MOCK_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Change password' }));
    expect(await screen.findByText(/Password changed/)).toBeInTheDocument();
  });

  it('sends an email-change confirmation link', async () => {
    const { user } = await renderSignedIn('/settings/security');
    await user.type(await screen.findByLabelText('New email address'), 'alice.new@example.com');
    await user.type(screen.getAllByLabelText('Current password')[1]!, MOCK_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Send confirmation link' }));
    expect(await screen.findByText(/Check alice.new@example.com for a confirmation link/)).toBeInTheDocument();
  });

  it('sets up two-factor authentication and shows recovery codes', async () => {
    const { user } = await renderSignedIn('/settings/security');
    expect(await screen.findByText('Off')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Set up two-factor authentication' }));
    expect(await screen.findByText('JBSWY3DPEHPK3PXP')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Authentication code'), '000000');
    await user.click(screen.getByRole('button', { name: 'Turn on two-factor authentication' }));
    expect(await screen.findByLabelText('Authentication code')).toHaveAccessibleDescription(
      'That code is not valid. Try the current code.',
    );

    await user.clear(screen.getByLabelText('Authentication code'));
    await user.type(screen.getByLabelText('Authentication code'), MOCK_MFA_CODE);
    await user.click(screen.getByRole('button', { name: 'Turn on two-factor authentication' }));
    const codes = await screen.findByRole('list', { name: 'Save your recovery codes' });
    expect(within(codes).getAllByRole('listitem')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'I saved my codes' }));
    expect(await screen.findByText('On')).toBeInTheDocument();
  });

  it('turns two-factor authentication off with password + code', async () => {
    const { user } = await renderSignedIn('/settings/security', 'mfa@example.com');
    await user.type(await screen.findByLabelText('Authentication code'), MOCK_MFA_CODE);
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    await user.click(await screen.findByRole('button', { name: 'Turn off' }));
    const dialog = await screen.findByRole('dialog', { name: 'Turn off two-factor authentication?' });
    await user.type(within(dialog).getByLabelText('Current password'), MOCK_PASSWORD);
    await user.type(within(dialog).getByLabelText('Authentication code'), MOCK_MFA_CODE);
    await user.click(within(dialog).getByRole('button', { name: 'Turn off' }));
    expect(await screen.findByText('Two-factor authentication is off')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Off')).toBeInTheDocument());
  });

  it('lists sessions and signs out another device', async () => {
    const { user } = await renderSignedIn('/settings/security');
    const list = await screen.findByRole('list', { name: "Where you're signed in" });
    expect(within(list).getByText('Safari on macOS')).toBeInTheDocument();
    expect(within(list).getByText('This device')).toBeInTheDocument();

    await user.click(within(list).getByRole('button', { name: 'Sign out Firefox on Windows' }));
    const dialog = await screen.findByRole('dialog', { name: 'Sign out this device?' });
    await user.click(within(dialog).getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(within(list).queryByText('Firefox on Windows')).not.toBeInTheDocument());
  });

  it('signs out everywhere', async () => {
    const { user, router } = await renderSignedIn('/settings/security');
    await user.click(await screen.findByRole('button', { name: 'Sign out everywhere' }));
    const dialog = await screen.findByRole('dialog', { name: 'Sign out everywhere?' });
    await user.click(within(dialog).getByRole('button', { name: 'Sign out everywhere' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'));
  });

  it('shows an error with retry when sessions fail to load', { timeout: 15_000 }, async () => {
    server.use(http.get('*/v1/me/sessions', () => HttpResponse.json({}, { status: 500 })));
    const { user } = await renderSignedIn('/settings/security');
    // 5xx is retried twice with backoff before the error state shows
    expect(
      await screen.findByRole('heading', { name: "Couldn't load your sessions" }, { timeout: 6000 }),
    ).toBeInTheDocument();
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('list', { name: "Where you're signed in" })).toBeInTheDocument();
  });

  it('shows the platform MFA requirement without a turn-off button', async () => {
    const { user } = await renderSignedIn('/settings/security', 'owner@example.com');
    await user.type(await screen.findByLabelText('Authentication code'), MOCK_MFA_CODE);
    await user.click(screen.getByRole('button', { name: 'Turn on two-factor authentication' }));
    await user.click(await screen.findByRole('button', { name: 'I saved my codes — continue' }));
    expect(await screen.findByText(/Required for platform accounts/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Turn off' })).not.toBeInTheDocument();
  });
});

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_PASSWORD, MOCK_TOKENS } from '@/mocks/data';
import { renderApp } from '@/test/render';

describe('forgot password (US-01-2)', () => {
  it('always confirms with the same generic message', async () => {
    const user = userEvent.setup();
    renderApp('/forgot-password');
    await user.type(await screen.findByLabelText('Email'), 'anyone@example.com');
    await user.click(screen.getByRole('button', { name: 'Send reset link' }));
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText(/If an account exists for anyone@example.com/)).toBeInTheDocument();
  });
});

describe('reset password (US-01-2)', () => {
  it('checks length and confirmation client-side', async () => {
    const user = userEvent.setup();
    renderApp(`/reset-password/${MOCK_TOKENS.reset}`);
    await user.type(await screen.findByLabelText('New password'), 'short');
    await user.type(screen.getByLabelText('Confirm password'), 'other');
    await user.click(screen.getByRole('button', { name: 'Set new password' }));
    expect(await screen.findByText('Use at least 12 characters')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('maps the server password policy error onto the field', async () => {
    const user = userEvent.setup();
    renderApp(`/reset-password/${MOCK_TOKENS.reset}`);
    await user.type(await screen.findByLabelText('New password'), 'password1234');
    await user.type(screen.getByLabelText('Confirm password'), 'password1234');
    await user.click(screen.getByRole('button', { name: 'Set new password' }));
    expect(await screen.findByLabelText('New password')).toHaveAccessibleDescription(
      expect.stringContaining('Choose a less predictable password'),
    );
  });

  it('sets the password once; an invalid link offers a new one', async () => {
    const user = userEvent.setup();
    renderApp(`/reset-password/${MOCK_TOKENS.reset}`);
    await user.type(await screen.findByLabelText('New password'), MOCK_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), MOCK_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Set new password' }));
    expect(await screen.findByRole('heading', { name: 'Password updated' })).toBeInTheDocument();

    const bad = renderApp('/reset-password/used-or-unknown-token');
    await user.type(await bad.findByLabelText('New password'), MOCK_PASSWORD);
    await user.type(bad.getByLabelText('Confirm password'), MOCK_PASSWORD);
    await user.click(bad.getByRole('button', { name: 'Set new password' }));
    expect(await bad.findByRole('link', { name: 'Request a new link' })).toHaveAttribute('href', '/forgot-password');
  });
});

describe('accept invitation (US-01-1)', () => {
  it('creates the account and accepts', async () => {
    const user = userEvent.setup();
    renderApp(`/accept-invite/${MOCK_TOKENS.invite}`);
    await user.type(await screen.findByLabelText('Full name'), 'Ivy Invitee');
    await user.type(screen.getByLabelText('New password'), MOCK_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Create account and join' }));
    expect(await screen.findByRole('heading', { name: "You're in" })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
  });

  it('existing-account path falls back to the form when the API asks for a password', async () => {
    const user = userEvent.setup();
    renderApp(`/accept-invite/${MOCK_TOKENS.invite}`);
    await user.click(await screen.findByRole('button', { name: 'I already have an account' }));
    await user.click(screen.getByRole('button', { name: 'Accept invitation' }));
    expect(await screen.findByLabelText('New password')).toHaveAccessibleDescription(
      expect.stringContaining('Required'),
    );
  });

  it('explains an expired or revoked invitation', async () => {
    const user = userEvent.setup();
    renderApp('/accept-invite/not-a-valid-token-000000');
    await user.type(await screen.findByLabelText('Full name'), 'Ivy');
    await user.type(screen.getByLabelText('New password'), MOCK_PASSWORD);
    await user.click(screen.getByRole('button', { name: 'Create account and join' }));
    expect(await screen.findByRole('heading', { name: "This invitation can't be used" })).toBeInTheDocument();
  });
});

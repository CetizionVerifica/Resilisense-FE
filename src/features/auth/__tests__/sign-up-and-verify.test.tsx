import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_PASSWORD, MOCK_TOKENS } from '@/mocks/data';
import { renderApp } from '@/test/render';

async function fillSignUp(password = MOCK_PASSWORD) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('Full name'), 'Sam Starter');
  await user.type(screen.getByLabelText('Work email'), 'sam@example.com');
  await user.type(screen.getByLabelText('New password'), password);
  await user.type(screen.getByLabelText('Organisation name'), 'Starter Co');
  await user.click(screen.getByRole('button', { name: 'Create account' }));
  return user;
}

describe('sign-up (M01 §4.1, §7.1)', () => {
  it('is linked from sign-in', async () => {
    renderApp('/sign-in');
    expect(await screen.findByRole('link', { name: 'Start a free trial' })).toHaveAttribute('href', '/sign-up');
  });

  it('validates required fields and the password length', async () => {
    const user = userEvent.setup();
    renderApp('/sign-up');
    await user.type(await screen.findByLabelText('New password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByLabelText('Full name')).toHaveAccessibleDescription('This field is required');
    expect(screen.getByLabelText('New password')).toHaveAccessibleDescription(
      expect.stringContaining('Use at least 12 characters'),
    );
  });

  it('always answers with "check your email" and can resend the link', async () => {
    renderApp('/sign-up');
    const user = await fillSignUp();
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
    expect(screen.getByText(/We sent a confirmation link to sam@example.com/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Send a new link' }));
    expect(await screen.findByText('A new link is on its way.')).toBeInTheDocument();
  });

  it('maps the server password policy onto the field', async () => {
    renderApp('/sign-up');
    await fillSignUp('password1234');
    expect(await screen.findByLabelText('New password')).toHaveAccessibleDescription(
      expect.stringContaining('Choose a less predictable password'),
    );
  });
});

describe('verify email (M01 §4.1)', () => {
  it('only uses the single-use token on an explicit click', async () => {
    const user = userEvent.setup();
    renderApp(`/verify-email/${MOCK_TOKENS.verify}`);
    await user.click(await screen.findByRole('button', { name: 'Confirm email address' }));
    expect(await screen.findByRole('heading', { name: 'Email confirmed' })).toBeInTheDocument();
    expect(screen.getByText('Your workspace is ready. Sign in to get started.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
  });

  it('confirms an email change', async () => {
    const user = userEvent.setup();
    renderApp(`/verify-email/${MOCK_TOKENS.verifyEmailChange}`);
    await user.click(await screen.findByRole('button', { name: 'Confirm email address' }));
    expect(await screen.findByText(/Your email address was changed/)).toBeInTheDocument();
  });

  it('offers a new link when the token is invalid or used', async () => {
    const user = userEvent.setup();
    renderApp('/verify-email/expired-token-000000000');
    await user.click(await screen.findByRole('button', { name: 'Confirm email address' }));
    expect(await screen.findByRole('heading', { name: "This link can't be used" })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.click(screen.getByRole('button', { name: 'Send a new link' }));
    expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
  });
});

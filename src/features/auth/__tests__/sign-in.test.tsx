import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_MFA_CODE, MOCK_PASSWORD } from '@/mocks/data';
import { renderApp } from '@/test/render';

async function signIn(email: string, password = MOCK_PASSWORD) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  return user;
}

describe('sign-in (M01 §4.1)', () => {
  it('redirects anonymous users to /sign-in and back to the requested page after signing in', async () => {
    const { router } = renderApp('/');
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'));
    await signIn('alice@example.com');
    expect(await screen.findByRole('heading', { name: 'Welcome, Alice Admin' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('shows a generic error for wrong credentials', async () => {
    renderApp('/sign-in');
    await signIn('alice@example.com', 'wrong password');
    expect(await screen.findByRole('alert')).toHaveTextContent('Email or password is incorrect.');
  });

  it('validates the form before calling the API', async () => {
    const user = userEvent.setup();
    renderApp('/sign-in');
    await user.click(await screen.findByRole('button', { name: 'Sign in' }));
    expect(await screen.findByLabelText('Email')).toHaveAccessibleDescription('This field is required');
  });

  it('asks for the second factor when MFA is enabled; recovery codes work too', async () => {
    const user = await (async () => {
      renderApp('/sign-in');
      return signIn('mfa@example.com');
    })();
    expect(await screen.findByRole('heading', { name: 'Two-factor authentication' })).toBeInTheDocument();
    await user.type(screen.getByLabelText('Authentication code'), '000000');
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(await screen.findByText('That code is not valid. Try the current code.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Use a recovery code' }));
    await user.type(screen.getByLabelText('Recovery code'), 'abcde-12345');
    await user.click(screen.getByRole('button', { name: 'Verify' }));
    expect(await screen.findByRole('heading', { name: 'Welcome, Mia Factor' })).toBeInTheDocument();
  });

  it('platform users enrol MFA, see recovery codes once, then continue', async () => {
    renderApp('/sign-in');
    const user = await signIn('owner@example.com');
    expect(await screen.findByRole('heading', { name: 'Set up two-factor authentication' })).toBeInTheDocument();
    expect(await screen.findByText('JBSWY3DPEHPK3PXP')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Authentication code'), MOCK_MFA_CODE);
    await user.click(screen.getByRole('button', { name: 'Turn on two-factor authentication' }));
    expect(await screen.findByText('abcde-12345')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'I saved my codes — continue' }));
    expect(await screen.findByRole('heading', { name: 'Welcome, Paula Platform' })).toBeInTheDocument();
  });

  it('restores the session silently from the refresh cookie on reload', async () => {
    const first = renderApp('/sign-in');
    await signIn('alice@example.com');
    await screen.findByRole('heading', { name: 'Welcome, Alice Admin' });
    first.unmount();
    const { authToken } = await import('@/lib/auth-token');
    authToken.set(null); // a reload loses the in-memory token; the cookie remains
    renderApp('/');
    expect(await screen.findByRole('heading', { name: 'Welcome, Alice Admin' })).toBeInTheDocument();
  });
});

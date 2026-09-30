import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_PASSWORD } from '@/mocks/data';
import { renderApp } from './render';

/**
 * Opens a protected URL as an MSW fixture user: the guard sends us to /sign-in, we sign in, and
 * the app returns to the URL (the real redirect flow, no token shortcuts).
 */
export async function renderSignedIn(url: string, email = 'alice@example.com') {
  const user = userEvent.setup();
  const app = renderApp(url);
  await user.type(await screen.findByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), MOCK_PASSWORD);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  return { user, ...app };
}

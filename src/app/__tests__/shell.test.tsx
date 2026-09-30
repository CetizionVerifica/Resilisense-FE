import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProviders } from '@/app/providers';
import { RequirePermission } from '@/lib/auth/guards';
import { MOCK_PASSWORD } from '@/mocks/data';
import { renderApp } from '@/test/render';

async function signedIn() {
  const user = userEvent.setup();
  const app = renderApp('/sign-in');
  await user.type(await screen.findByLabelText('Email'), 'alice@example.com');
  await user.type(screen.getByLabelText('Password'), MOCK_PASSWORD);
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  await screen.findByRole('heading', { name: 'Welcome, Alice Admin' });
  return { user, ...app };
}

describe('app shell (02 §3)', () => {
  it('switches workspace from the top bar (US-01-3)', async () => {
    const { user } = await signedIn();
    const trigger = screen.getByRole('button', { name: 'Switch workspace' });
    expect(trigger).toHaveTextContent('Acme Industries');
    await user.click(trigger);
    await user.click(await screen.findByRole('menuitemradio', { name: /Beta Foods/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch workspace' })).toHaveTextContent('Beta Foods'),
    );
  });

  it('opens the command palette with Ctrl+K', async () => {
    const { user } = await signedIn();
    await user.keyboard('{Control>}k{/Control}');
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    expect(within(dialog).getByRole('option', { name: 'Home' })).toBeInTheDocument();
  });

  it('signs out from the user menu', async () => {
    const { user, router } = await signedIn();
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Sign out' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'));
  });

  it('switches to dark theme from the user menu, keyboard only', async () => {
    const { user } = await signedIn();
    screen.getByRole('button', { name: 'Account menu' }).focus();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    // keyboard-opened menus focus the first item (Account settings); next is Theme
    await user.keyboard('{ArrowDown}{ArrowRight}'); // open submenu → System
    await screen.findByRole('menuitemradio', { name: 'System' });
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}'); // Light → Dark
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('renders a 404 page for unknown routes', async () => {
    renderApp('/definitely/not/here');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('RequirePermission follows GET /v1/me', async () => {
    const { apiFetch } = await import('@/lib/api-client');
    const { authToken } = await import('@/lib/auth-token');
    const session = await apiFetch<{ accessToken: string }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'alice@example.com', password: MOCK_PASSWORD }),
    });
    authToken.set(session.accessToken);
    render(
      <AppProviders>
        <RequirePermission permission="org:manage-users">
          <span>allowed</span>
        </RequirePermission>
        <RequirePermission permission="gap:review" fallback={<span>denied</span>}>
          <span>hidden</span>
        </RequirePermission>
      </AppProviders>,
    );
    expect(await screen.findByText('allowed')).toBeInTheDocument();
    expect(screen.getByText('denied')).toBeInTheDocument();
    expect(screen.queryByText('hidden')).not.toBeInTheDocument();
  });
});

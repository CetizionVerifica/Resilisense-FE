import { screen, waitFor } from '@testing-library/react';
import { http } from 'msw';
import { problem } from '@/mocks/handlers';
import { server } from '@/test/server';
import { renderSignedIn } from '@/test/session';

describe('terms acceptance gate (M01 §4.1, §7.1)', () => {
  it('blocks the app until the current version is accepted', async () => {
    const { user } = await renderSignedIn('/', 'terms@example.com');
    expect(await screen.findByRole('heading', { name: 'Review the updated terms' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Accept and continue' }));
    expect(
      await screen.findByRole('checkbox', { name: 'I have read and accept the terms and licence agreement' }),
    ).toHaveAccessibleDescription('Accept the terms to continue');

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Accept and continue' }));
    expect(await screen.findByRole('heading', { name: 'Welcome, Terry Terms' })).toBeInTheDocument();
  });

  it('lets the user sign out instead', async () => {
    const { user, router } = await renderSignedIn('/', 'terms@example.com');
    await user.click(await screen.findByRole('button', { name: 'Sign out instead' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/sign-in'));
  });

  it('does not ask for acceptance when the version is current', async () => {
    await renderSignedIn('/');
    expect(await screen.findByRole('heading', { name: 'Welcome, Alice Admin' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Review the updated terms' })).not.toBeInTheDocument();
  });
});

describe('impersonation banner (M01 §4.2, §7.1)', () => {
  it('shows who is impersonating and returns to the platform owner', async () => {
    const { user } = await renderSignedIn('/', 'impersonated@example.com');
    expect(await screen.findByRole('heading', { name: 'Welcome, Ian Impersonated' })).toBeInTheDocument();
    expect(screen.getByText(/signed in as Ian Impersonated .* on behalf of Paula Platform/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'End impersonation' }));
    expect(await screen.findByRole('heading', { name: 'Welcome, Paula Platform' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'End impersonation' })).not.toBeInTheDocument();
  });

  it('is absent in a normal session', async () => {
    await renderSignedIn('/');
    await screen.findByRole('heading', { name: 'Welcome, Alice Admin' });
    expect(screen.queryByRole('button', { name: 'End impersonation' })).not.toBeInTheDocument();
  });
});

describe('review fixes', () => {
  it('fails closed: no app when /me cannot be loaded', { timeout: 15_000 }, async () => {
    server.use(http.get('*/v1/me', () => problem(500, 'internal_error', 'Internal server error')));
    await renderSignedIn('/');
    expect(await screen.findByRole('heading', { name: 'Something went wrong' }, { timeout: 6000 })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Main navigation' })).not.toBeInTheDocument();
  });

  it('an expired impersonation returns to the owner instead of silently refreshing as them', async () => {
    const { user } = await renderSignedIn('/', 'impersonated@example.com');
    await screen.findByRole('button', { name: 'End impersonation' });
    server.use(http.patch('*/v1/me', () => problem(401, 'unauthenticated', 'Token expired'), { once: true }));
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Account settings' }));
    await user.type(await screen.findByLabelText('Job title'), 'Analyst');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'End impersonation' })).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    expect(await screen.findByText('Paula Platform')).toBeInTheDocument();
  });

  it('keeps the shell mounted while /me refetches after a workspace switch', async () => {
    const { user } = await renderSignedIn('/');
    await screen.findByRole('heading', { name: 'Welcome, Alice Admin' });
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    await user.click(screen.getByRole('button', { name: 'Switch workspace' }));
    await user.click(await screen.findByRole('menuitemradio', { name: /Beta Foods/ }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch workspace' })).toHaveTextContent('Beta Foods'),
    );
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBe(nav);
  });
});

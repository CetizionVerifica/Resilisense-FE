import { screen, waitFor } from '@testing-library/react';
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

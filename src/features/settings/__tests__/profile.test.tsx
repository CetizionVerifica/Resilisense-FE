import { screen, waitFor, within } from '@testing-library/react';
import { renderSignedIn } from '@/test/session';

describe('settings (M01 §9)', () => {
  it('opens on the profile tab with route-backed tabs', async () => {
    const { router } = await renderSignedIn('/settings');
    await waitFor(() => expect(router.state.location.pathname).toBe('/settings/profile'));
    const tabs = await screen.findByRole('navigation', { name: 'Settings sections' });
    await waitFor(() =>
      expect(within(tabs).getByRole('link', { name: 'Profile' })).toHaveAttribute('aria-current', 'page'),
    );
    expect(within(tabs).getByRole('link', { name: 'Members' })).toHaveAttribute('href', '/settings/members');
  });

  it('hides the members tab without org:manage-users', async () => {
    const { user } = await renderSignedIn('/settings/profile');
    await user.click(await screen.findByRole('button', { name: 'Switch workspace' }));
    await user.click(await screen.findByRole('menuitemradio', { name: /Beta Foods/ }));
    await waitFor(() =>
      expect(
        within(screen.getByRole('navigation', { name: 'Settings sections' })).queryByRole('link', { name: 'Members' }),
      ).not.toBeInTheDocument(),
    );
  });
});

describe('profile (M01 §4.1)', () => {
  it('saves profile fields and applies the theme straight away', async () => {
    const { user } = await renderSignedIn('/settings/profile');
    const name = await screen.findByLabelText('Full name');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();

    await user.clear(name);
    await user.type(name, 'Alice Adams');
    await user.type(screen.getByLabelText('Job title'), 'Sustainability lead');
    await user.selectOptions(screen.getByLabelText('Time zone'), 'Europe/Bucharest');
    await user.click(screen.getByRole('radio', { name: 'Dark' }));
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Profile saved')).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'));
    // the account menu reads the same cached /me
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    expect(await screen.findByText('Alice Adams')).toBeInTheDocument();
  });

  it('validates the phone number and the required name', async () => {
    const { user } = await renderSignedIn('/settings/profile');
    const name = await screen.findByLabelText('Full name');
    await user.clear(name);
    await user.type(screen.getByLabelText('Phone'), 'call me');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByLabelText('Full name')).toHaveAccessibleDescription('This field is required');
    expect(screen.getByLabelText('Phone')).toHaveAccessibleDescription(expect.stringContaining('Use digits'));
  });
});

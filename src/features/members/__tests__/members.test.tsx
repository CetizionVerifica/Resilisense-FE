import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { renderSignedIn } from '@/test/session';
import { server } from '@/test/server';

const table = (name: string) => screen.findByRole('table', { name });
const row = async (tableName: string, text: string) =>
  within(await table(tableName))
    .getByText(text)
    .closest('tr')!;

describe('members list (M01 §9)', () => {
  it('lists members with role, access, status and marks yourself', async () => {
    await renderSignedIn('/settings/members');
    const olga = await row('Members', 'Olga Owner');
    expect(within(olga).getByText('Owner')).toBeInTheDocument();
    expect(within(olga).getByText('Whole workspace')).toBeInTheDocument();
    expect(within(olga).getByText('Active')).toBeInTheDocument();
    expect(within(await row('Members', 'Carl Contributor')).getByText('0 companies, 1 project')).toBeInTheDocument();
    expect(within(await row('Members', 'Vera Viewer')).getByText('Deactivated')).toBeInTheDocument();
    const me = await row('Members', 'Alice Admin');
    expect(within(me).getByText('You')).toBeInTheDocument();
    expect(within(me).queryByRole('button', { name: /Actions for/ })).not.toBeInTheDocument();
  });

  it('filters by role and status through the URL', async () => {
    const { user, router } = await renderSignedIn('/settings/members');
    await table('Members');
    await user.selectOptions(screen.getByLabelText('Role'), 'contributor');
    await waitFor(() => expect(router.state.location.search).toBe('?role=contributor'));
    await waitFor(() => expect(screen.queryByText('Olga Owner')).not.toBeInTheDocument());
    expect(screen.getByText('Carl Contributor')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Status'), 'deactivated');
    expect(await screen.findByRole('heading', { name: 'No members match these filters' })).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]!);
    expect(await screen.findByText('Olga Owner')).toBeInTheDocument();
    expect(router.state.location.search).toBe('');
  });

  it('shows the error state and recovers on retry', { timeout: 15_000 }, async () => {
    server.use(http.get('*/v1/workspaces/:wid/members', () => HttpResponse.json({}, { status: 500 })));
    const { user } = await renderSignedIn('/settings/members');
    expect(
      await screen.findByRole('heading', { name: "Couldn't load members" }, { timeout: 6000 }),
    ).toBeInTheDocument();
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await table('Members')).toBeInTheDocument();
  });

  it('shows the empty state with an invite action', async () => {
    server.use(http.get('*/v1/workspaces/:wid/members', () => HttpResponse.json({ items: [], nextCursor: null })));
    await renderSignedIn('/settings/members');
    expect(await screen.findByRole('heading', { name: 'No members yet' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Invite people' })).toHaveLength(2);
  });

  it('pages with "Load more"', async () => {
    const make = (n: number) => ({
      id: `01920000-0000-7000-8000-${String(n).padStart(12, '0')}`,
      userId: `01920000-0000-7000-8000-${String(n + 500).padStart(12, '0')}`,
      name: `Person ${n}`,
      email: `p${n}@example.com`,
      role: 'viewer',
      companyIds: [],
      projectIds: [],
      status: 'active',
      lastLoginAt: null,
      expiresAt: null,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    server.use(
      http.get('*/v1/workspaces/:wid/members', ({ request }) => {
        const cursor = new URL(request.url).searchParams.get('cursor');
        return HttpResponse.json(
          cursor
            ? { items: [make(26)], nextCursor: null }
            : { items: Array.from({ length: 25 }, (_, i) => make(i + 1)), nextCursor: make(25).id },
        );
      }),
    );
    const { user } = await renderSignedIn('/settings/members');
    await screen.findByText('Person 25');
    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(await screen.findByText('Person 26')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('explains the page to users without org:manage-users', async () => {
    const { user } = await renderSignedIn('/settings/members');
    await table('Members');
    await user.click(screen.getByRole('button', { name: 'Switch workspace' }));
    await user.click(await screen.findByRole('menuitemradio', { name: /Beta Foods/ }));
    expect(await screen.findByRole('heading', { name: "You can't manage members" })).toBeInTheDocument();
  });
});

describe('member actions (M01 §4.1, §7)', () => {
  it('changes a role (owner is not offered to an admin)', async () => {
    const { user } = await renderSignedIn('/settings/members');
    await user.click(
      within(await row('Members', 'Carl Contributor')).getByRole('button', { name: 'Actions for Carl Contributor' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Change role…' }));
    const dialog = await screen.findByRole('dialog', { name: 'Change role of Carl Contributor' });
    const select = within(dialog).getByLabelText('Role');
    expect(within(select).queryByRole('option', { name: 'Owner' })).not.toBeInTheDocument();
    await user.selectOptions(select, 'auditor');
    await user.click(within(dialog).getByRole('button', { name: 'Change role' }));
    expect(await screen.findByText('Carl Contributor is now Auditor')).toBeInTheDocument();
    await waitFor(async () =>
      expect(within(await row('Members', 'Carl Contributor')).getByText('Auditor')).toBeInTheDocument(),
    );
  });

  it('keeps at least one owner (server conflict shown in the dialog)', async () => {
    const { user } = await renderSignedIn('/settings/members');
    await user.click(
      within(await row('Members', 'Olga Owner')).getByRole('button', { name: 'Actions for Olga Owner' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Remove from workspace' }));
    const dialog = await screen.findByRole('dialog', { name: 'Remove Olga Owner from this workspace?' });
    expect(within(dialog).getByText(/olga@example.com/)).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Remove' }));
    expect(await within(dialog).findByRole('alert')).toHaveTextContent('A workspace must keep at least one owner');
  });

  it('deactivates, reactivates and removes a member', async () => {
    const { user } = await renderSignedIn('/settings/members');
    await user.click(
      within(await row('Members', 'Carl Contributor')).getByRole('button', { name: 'Actions for Carl Contributor' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Deactivate' }));
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Deactivate Carl Contributor?' })).getByRole('button', {
        name: 'Deactivate',
      }),
    );
    await waitFor(async () =>
      expect(within(await row('Members', 'Carl Contributor')).getByText('Deactivated')).toBeInTheDocument(),
    );

    await user.click(
      within(await row('Members', 'Vera Viewer')).getByRole('button', { name: 'Actions for Vera Viewer' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Remove from workspace' }));
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Remove Vera Viewer from this workspace?' })).getByRole(
        'button',
        { name: 'Remove' },
      ),
    );
    await waitFor(() => expect(screen.queryByText('Vera Viewer')).not.toBeInTheDocument());
  });
});

describe('invitations (M01 §4.1, US-01-1)', () => {
  it('invites several people by email and shows per-address results', async () => {
    const { user, router } = await renderSignedIn('/settings/members');
    await table('Members');
    await user.click(screen.getByRole('button', { name: 'Invite people' }));
    const sheet = await screen.findByRole('dialog', { name: 'Invite people' });
    expect(router.state.location.search).toBe('?invite=1');

    await user.click(within(sheet).getByRole('button', { name: 'Send invitations' }));
    expect(within(sheet).getByLabelText('Email addresses')).toHaveAccessibleDescription(
      expect.stringContaining('This field is required'),
    );
    await user.type(within(sheet).getByLabelText('Email addresses'), 'new1@example.com, not-an-email');
    await user.click(within(sheet).getByRole('button', { name: 'Send 2 invitations' }));
    expect(within(sheet).getByLabelText('Email addresses')).toHaveAccessibleDescription(
      expect.stringContaining("aren't valid email addresses"),
    );

    await user.clear(within(sheet).getByLabelText('Email addresses'));
    await user.type(within(sheet).getByLabelText('Email addresses'), 'new1@example.com\nolga@example.com');
    await user.selectOptions(within(sheet).getByLabelText('Role'), 'viewer');
    await user.click(within(sheet).getByRole('button', { name: 'Send 2 invitations' }));
    expect(await within(sheet).findByText('1 invitation sent, 1 already a member.')).toBeInTheDocument();

    await user.click(within(sheet).getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(router.state.location.search).toBe(''));
    await user.click(screen.getByRole('tab', { name: 'Pending invitations' }));
    expect(await within(await table('Pending invitations')).findByText('new1@example.com')).toBeInTheDocument();
  });

  it('opens from the URL and reports CSV line errors', async () => {
    const { user } = await renderSignedIn('/settings/members?invite=1');
    const sheet = await screen.findByRole('dialog', { name: 'Invite people' });
    await user.click(within(sheet).getByRole('tab', { name: 'Upload CSV' }));
    const file = new File(
      ['email,role,company_ids,project_ids\nbad-email,viewer,,\nok@example.com,boss,,\n'],
      'people.csv',
      {
        type: 'text/csv',
      },
    );
    await user.upload(within(sheet).getByLabelText('CSV file'), file);
    await user.click(within(sheet).getByRole('button', { name: 'Upload and invite' }));
    const alert = await within(sheet).findByRole('alert');
    expect(alert).toHaveTextContent('Line 2: Invalid email');
    expect(alert).toHaveTextContent('Line 3: Unknown role');
  });

  it('uploads a valid CSV', async () => {
    const { user } = await renderSignedIn('/settings/members?invite=1');
    const sheet = await screen.findByRole('dialog', { name: 'Invite people' });
    await user.click(within(sheet).getByRole('tab', { name: 'Upload CSV' }));
    await user.upload(
      within(sheet).getByLabelText('CSV file'),
      new File(['email,role,company_ids,project_ids\nfrank@example.com,contributor,,\n'], 'people.csv', {
        type: 'text/csv',
      }),
    );
    await user.click(within(sheet).getByRole('button', { name: 'Upload and invite' }));
    expect(await within(sheet).findByText('1 invitation sent.')).toBeInTheDocument();
  });

  it('resends and revokes pending invitations', async () => {
    const { user } = await renderSignedIn('/settings/members?tab=invitations');
    const expired = await row('Pending invitations', 'eli@example.com');
    expect(within(expired).getByText('Expired')).toBeInTheDocument();
    await user.click(within(expired).getByRole('button', { name: 'Resend invitation to eli@example.com' }));
    expect(await screen.findByText('Invitation sent again to eli@example.com')).toBeInTheDocument();
    await waitFor(async () =>
      expect(within(await row('Pending invitations', 'eli@example.com')).getByText(/^Expires/)).toBeInTheDocument(),
    );

    await user.click(
      within(await row('Pending invitations', 'dana@example.com')).getByRole('button', {
        name: 'Revoke invitation to dana@example.com',
      }),
    );
    await user.click(
      within(await screen.findByRole('dialog', { name: 'Revoke this invitation?' })).getByRole('button', {
        name: 'Revoke',
      }),
    );
    await waitFor(() => expect(screen.queryByText('dana@example.com')).not.toBeInTheDocument());
  });
});

describe('dialog state is reset on every close (review fixes)', () => {
  it('reopening the invite sheet after "Done" shows the form, not the old results', async () => {
    const { user } = await renderSignedIn('/settings/members?invite=1');
    const sheet = await screen.findByRole('dialog', { name: 'Invite people' });
    await user.type(within(sheet).getByLabelText('Email addresses'), 'zoe@example.com');
    await user.click(within(sheet).getByRole('button', { name: 'Send 1 invitation' }));
    await user.click(await within(sheet).findByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Invite people' }));
    expect(await screen.findByLabelText('Email addresses')).toHaveValue('');
  });

  it('a cancelled role choice is not preselected for the next member', async () => {
    const { user } = await renderSignedIn('/settings/members');
    await user.click(
      within(await row('Members', 'Olga Owner')).getByRole('button', { name: 'Actions for Olga Owner' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Change role…' }));
    let dialog = await screen.findByRole('dialog', { name: 'Change role of Olga Owner' });
    await user.selectOptions(within(dialog).getByLabelText('Role'), 'viewer');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    await user.click(
      within(await row('Members', 'Carl Contributor')).getByRole('button', { name: 'Actions for Carl Contributor' }),
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Change role…' }));
    dialog = await screen.findByRole('dialog', { name: 'Change role of Carl Contributor' });
    expect(within(dialog).getByLabelText('Role')).toHaveValue('contributor');
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { WS_ACME } from '@/mocks/data';
import { problem } from '@/mocks/handlers';
import { server } from '@/test/server';
import { renderSignedIn } from '@/test/session';

describe('workspace settings (M02 §9)', () => {
  it('is read-only for admins without workspace:manage', async () => {
    await renderSignedIn('/settings/workspace');
    expect(
      await screen.findByText('Only the workspace owner or an admin can change these settings.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Workspace name')).toHaveValue('Acme Industries');
    expect(screen.getByLabelText('Workspace name')).toBeDisabled();
    expect(screen.getByLabelText('Data region')).toHaveValue('European Union');
    expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument();
    expect(screen.queryByText('Partner access')).not.toBeInTheDocument();
  });

  it('lets the owner rename the workspace and validates the accent colour', async () => {
    const { user } = await renderSignedIn('/settings/workspace', 'partner@example.com');
    const name = await screen.findByLabelText('Workspace name');
    await user.clear(name);
    await user.type(name, 'Verde Advisory Group');
    const color = screen.getByLabelText('Report accent colour');
    await user.type(color, 'orange');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(color).toHaveAccessibleDescription(/Enter a hex colour/);
    await user.clear(color);
    await user.type(color, '#D8882A');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Workspace settings saved')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch workspace' })).toHaveTextContent('Verde Advisory Group'),
    );
  });

  it('US-02-2: lets the owner revoke a partner grant', async () => {
    let grants = [
      {
        id: '0192a000-0000-7000-8000-0000000000a1',
        partnerWorkspaceId: WS_ACME,
        partnerName: 'Acme Consulting',
        createdAt: '2026-02-01T09:00:00.000Z',
      },
    ];
    server.use(
      http.get('*/v1/workspaces/current/partner-grants', () => HttpResponse.json({ items: grants })),
      http.delete('*/v1/workspaces/current/partner-grants/:id', () => {
        grants = [];
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const { user } = await renderSignedIn('/settings/workspace', 'partner@example.com');
    await user.click(await screen.findByRole('button', { name: 'Revoke access' }));
    const dialog = await screen.findByRole('dialog', { name: 'Revoke access for Acme Consulting?' });
    await user.click(within(dialog).getByRole('button', { name: 'Revoke access' }));
    expect(await screen.findByText('Access for Acme Consulting was revoked')).toBeInTheDocument();
    expect(await screen.findByText('No partner has access to this workspace.')).toBeInTheDocument();
  });

  it('shows the error state and recovers on retry', { timeout: 15_000 }, async () => {
    server.use(http.get('*/v1/workspaces/current', () => problem(500, 'internal_error', 'Internal server error')));
    const { user } = await renderSignedIn('/settings/workspace');
    expect(
      await screen.findByRole('heading', { name: 'Could not load the workspace' }, { timeout: 6000 }),
    ).toBeInTheDocument();
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByLabelText('Workspace name')).toBeInTheDocument();
  });
});

describe('plan & usage (M02 §9)', () => {
  it('shows the plan, usage against limits and the modules included', async () => {
    await renderSignedIn('/settings/plan');
    expect(await screen.findByText('Professional plan')).toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Companies' })).toHaveAttribute('aria-valuetext', '2 of 3');
    expect(screen.getByText('Up to 10 projects per year')).toBeInTheDocument();
    const modules = screen.getByRole('list', { name: 'Modules' });
    expect(within(modules).getByText('Gap analysis').closest('li')).toHaveTextContent('Included');
    expect(within(modules).getByText('Carbon accounting').closest('li')).toHaveTextContent('Not included');
  });

  it('shows the error state', { timeout: 15_000 }, async () => {
    server.use(
      http.get('*/v1/workspaces/current/entitlements', () => problem(500, 'internal_error', 'Internal server error')),
    );
    await renderSignedIn('/settings/plan');
    expect(
      await screen.findByRole('heading', { name: 'Could not load your plan' }, { timeout: 6000 }),
    ).toBeInTheDocument();
  });
});

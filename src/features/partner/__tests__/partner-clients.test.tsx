import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/server';
import { renderSignedIn } from '@/test/session';

const clients = () => screen.findByRole('table', { name: 'Client workspaces' });

describe('partner console (M02 US-02-1)', () => {
  it('lists client workspaces with usage', async () => {
    await renderSignedIn('/partner/clients', 'partner@example.com');
    const row = within(await clients())
      .getByText('Nordwind Logistics')
      .closest('tr')!;
    expect(within(row).getByText('Active')).toBeInTheDocument();
    expect(within(row).getByRole('button', { name: 'Open Nordwind Logistics' })).toBeInTheDocument();
    expect(screen.getByText('1 of 3 client workspaces used')).toBeInTheDocument();
  });

  it('onboards a client: workspace, first company and owner invitation', async () => {
    const { user } = await renderSignedIn('/partner/clients', 'partner@example.com');
    await clients();
    await user.click(screen.getByRole('button', { name: 'Onboard client' }));
    const sheet = await screen.findByRole('dialog', { name: 'Onboard a client' });
    await user.click(within(sheet).getByRole('button', { name: 'Create workspace' }));
    expect(within(sheet).getByLabelText('Owner email')).toHaveAccessibleDescription(/required/i);

    await user.type(within(sheet).getByLabelText('Workspace name'), 'Sole Textiles');
    await user.selectOptions(within(sheet).getByLabelText('Workspace country'), 'IN');
    await user.type(within(sheet).getByLabelText('Owner email'), 'Ravi@Sole.example');
    await user.type(within(sheet).getByLabelText('Legal name'), 'Sole Textiles Pvt Ltd');
    await user.selectOptions(within(sheet).getByLabelText('Country'), 'IN');
    await user.selectOptions(within(sheet).getByLabelText('Sector'), 'chemicals');
    await user.selectOptions(within(sheet).getByLabelText('Size'), 'medium');
    await user.selectOptions(within(sheet).getByLabelText('Reporting currency'), 'INR');
    await user.click(within(sheet).getByRole('button', { name: 'Create workspace' }));

    expect(
      await screen.findByText('Sole Textiles was created and an invitation was sent to Ravi@Sole.example'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        within(screen.getByRole('table', { name: 'Client workspaces' })).getByText('Sole Textiles'),
      ).toBeInTheDocument(),
    );
    expect(screen.getByText('2 of 3 client workspaces used')).toBeInTheDocument();
  });

  it('blocks onboarding at the plan limit', async () => {
    server.use(
      http.get('*/v1/partner/clients', () =>
        HttpResponse.json({ items: [], nextCursor: null, usage: { clientWorkspaces: 3, limit: 3 } }),
      ),
    );
    await renderSignedIn('/partner/clients', 'partner@example.com');
    expect(
      await screen.findByText('You have reached the number of client workspaces your plan allows.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Onboard client' })).toBeDisabled();
  });

  it('opens a client workspace through the switch', async () => {
    const { user } = await renderSignedIn('/partner/clients', 'partner@example.com');
    await user.click(await screen.findByRole('button', { name: 'Open Nordwind Logistics' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Switch workspace' })).toHaveTextContent('Nordwind Logistics'),
    );
  });

  it('is not offered to workspaces without client workspaces in their plan', async () => {
    await renderSignedIn('/partner/clients');
    expect(await screen.findByRole('heading', { name: 'Partner console not available' })).toBeInTheDocument();
    expect(
      within(screen.getAllByRole('navigation', { name: 'Main navigation' })[0]!).queryByRole('link', {
        name: 'Clients',
      }),
    ).not.toBeInTheDocument();
  });
});

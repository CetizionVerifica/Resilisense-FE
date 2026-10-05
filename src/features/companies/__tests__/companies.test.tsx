import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { COMPANY_ACME } from '@/mocks/data';
import { problem } from '@/mocks/handlers';
import { server } from '@/test/server';
import { renderSignedIn } from '@/test/session';

const table = (name = 'Active') => screen.findByRole('table', { name });
const row = async (text: string, tableName?: string) =>
  within(await table(tableName))
    .getByText(text)
    .closest('tr')!;

describe('companies list (M02 §9)', () => {
  it('lists active companies with sector, country and size', async () => {
    await renderSignedIn('/companies');
    const acme = await row('Acme Industries');
    expect(within(acme).getByText('Acme Industries GmbH')).toBeInTheDocument();
    expect(within(acme).getByText('Automotive')).toBeInTheDocument();
    expect(within(acme).getByText('Germany')).toBeInTheDocument();
    expect(within(acme).getByText('Large (250 or more employees)')).toBeInTheDocument();
    expect(within(await row('Acme East')).getByText('Romania')).toBeInTheDocument();
    expect(screen.queryByText('Acme Legacy Parts')).not.toBeInTheDocument();
  });

  it('searches through the URL and offers to clear an empty result', async () => {
    const { user, router } = await renderSignedIn('/companies');
    await table();
    await user.type(screen.getByRole('searchbox', { name: 'Search companies' }), 'east');
    await waitFor(() => expect(router.state.location.search).toBe('?q=east'));
    await waitFor(() => expect(screen.queryByText('Acme Industries GmbH')).not.toBeInTheDocument());
    expect(await screen.findByText('Acme East')).toBeInTheDocument();

    await user.type(screen.getByRole('searchbox', { name: 'Search companies' }), 'zzz');
    expect(await screen.findByRole('heading', { name: 'No matching companies' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(await screen.findByText('Acme Industries GmbH')).toBeInTheDocument();
    expect(router.state.location.search).toBe('');
  });

  it('shows the empty state with an add action', async () => {
    server.use(http.get('*/v1/companies', () => HttpResponse.json({ items: [], nextCursor: null })));
    await renderSignedIn('/companies');
    expect(await screen.findByRole('heading', { name: 'No companies yet' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add company' })).toHaveLength(2);
  });

  it('shows the error state and recovers on retry', { timeout: 15_000 }, async () => {
    server.use(http.get('*/v1/companies', () => problem(500, 'internal_error', 'Internal server error')));
    const { user } = await renderSignedIn('/companies');
    expect(
      await screen.findByRole('heading', { name: 'Could not load companies' }, { timeout: 6000 }),
    ).toBeInTheDocument();
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await table()).toBeInTheDocument();
  });

  it('restores a recently deleted company', async () => {
    const { user } = await renderSignedIn('/companies?view=deleted');
    const legacy = await row('Acme Legacy Parts', 'Recently deleted');
    await user.click(within(legacy).getByRole('button', { name: 'Restore Acme Legacy Parts' }));
    expect(await screen.findByText('Acme Legacy Parts was restored')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Nothing to restore' })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'Active' }));
    expect(await row('Acme Legacy Parts')).toBeInTheDocument();
  });
});

describe('add a company (US-02-4)', () => {
  it('validates, creates the company and opens it', async () => {
    const { user, router } = await renderSignedIn('/companies');
    await user.click(await screen.findByRole('button', { name: 'Add company' }));
    expect(router.state.location.search).toBe('?new=1');
    const sheet = await screen.findByRole('dialog', { name: 'Add a company' });
    await user.click(within(sheet).getByRole('button', { name: 'Add company' }));
    expect(within(sheet).getByLabelText('Legal name')).toHaveAccessibleDescription(/required/i);

    await user.type(within(sheet).getByLabelText('Legal name'), 'Acme West BV');
    await user.selectOptions(within(sheet).getByLabelText('Country'), 'FR');
    await user.selectOptions(within(sheet).getByLabelText('Sector'), 'logistics');
    await user.selectOptions(within(sheet).getByLabelText('Size'), 'medium');
    await user.selectOptions(within(sheet).getByLabelText('Reporting currency'), 'EUR');
    await user.selectOptions(within(sheet).getByLabelText('Parent company'), COMPANY_ACME);
    await user.click(within(sheet).getByRole('button', { name: 'Add company' }));

    expect(await screen.findByText('Acme West BV was added')).toBeInTheDocument();
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/companies\/[0-9a-f-]{36}$/));
    expect(await screen.findByRole('heading', { level: 1, name: 'Acme West BV' })).toBeInTheDocument();
    expect(screen.getByText('Services › Transport and logistics')).toBeInTheDocument();
  });

  it('explains the plan limit from the API', async () => {
    server.use(
      http.post('*/v1/companies', () =>
        HttpResponse.json(
          {
            type: 'https://resilisense.org/problems/limit_exceeded',
            title: 'Company limit reached',
            status: 403,
            max: 3,
          },
          { status: 403, headers: { 'content-type': 'application/problem+json' } },
        ),
      ),
    );
    const { user } = await renderSignedIn('/companies?new=1');
    const sheet = await screen.findByRole('dialog', { name: 'Add a company' });
    await user.type(within(sheet).getByLabelText('Legal name'), 'One Too Many');
    await user.selectOptions(await within(sheet).findByLabelText('Country'), 'DE');
    await user.selectOptions(within(sheet).getByLabelText('Sector'), 'chemicals');
    await user.selectOptions(within(sheet).getByLabelText('Size'), 'small');
    await user.selectOptions(within(sheet).getByLabelText('Reporting currency'), 'EUR');
    await user.click(within(sheet).getByRole('button', { name: 'Add company' }));
    expect(await within(sheet).findByText(/Your plan allows 3 companies/)).toBeInTheDocument();
  });
});

describe('company detail (M02 §9)', () => {
  it('shows the overview and the activity feed', async () => {
    const { user } = await renderSignedIn(`/companies/${COMPANY_ACME}`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Acme Industries' })).toBeInTheDocument();
    expect(screen.getByText('HRB 12345')).toBeInTheDocument();
    expect(screen.getByText('Manufacturing › Automotive')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Activity' }));
    const feed = await screen.findByRole('list', { name: 'Company activity' });
    expect(within(feed).getByText('Alice Admin updated the company')).toBeInTheDocument();
    expect(within(feed).getByText('Changed: Employees and Website')).toBeInTheDocument();
    expect(within(feed).getByText('System added the company')).toBeInTheDocument();
  });

  it('edits the profile and logs the change', async () => {
    const { user } = await renderSignedIn(`/companies/${COMPANY_ACME}/settings`);
    const employees = await screen.findByLabelText('Employees');
    await user.clear(employees);
    await user.type(employees, 'many');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(employees).toHaveAccessibleDescription('Enter a whole number');
    await user.clear(employees);
    await user.type(employees, '1500');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(await screen.findByText('Acme Industries was saved')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Activity' }));
    expect(await screen.findByText('Changed: Employees')).toBeInTheDocument();
  });

  it('deletes after typing the company name', async () => {
    const { user, router } = await renderSignedIn(`/companies/${COMPANY_ACME}/settings`);
    await user.click(await screen.findByRole('button', { name: 'Delete company' }));
    const dialog = await screen.findByRole('dialog', { name: 'Delete Acme Industries?' });
    const confirm = within(dialog).getByRole('button', { name: 'Delete company' });
    expect(confirm).toBeDisabled();
    await user.type(within(dialog).getByLabelText('Type Acme Industries to confirm'), 'acme industries');
    await user.click(confirm);
    expect(await screen.findByText(/Acme Industries was deleted/)).toBeInTheDocument();
    await waitFor(() => expect(router.state.location.pathname).toBe('/companies'));
    await waitFor(() => expect(screen.queryByText('Acme Industries GmbH')).not.toBeInTheDocument());
  });

  it('shows not found for an unknown company', async () => {
    await renderSignedIn('/companies/01920000-0000-7000-8000-000000000999');
    expect(await screen.findByRole('heading', { name: 'Company not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to companies' })).toBeInTheDocument();
  });
});

describe('suspended workspace (US-02-5)', () => {
  it('shows the notice and hides write actions', async () => {
    await renderSignedIn('/companies', 'suspended@example.com');
    expect(await screen.findByText(/Halted Holdings is suspended/)).toBeInTheDocument();
    expect(await row('Halted Holdings AG')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add company' })).not.toBeInTheDocument();
  });
});

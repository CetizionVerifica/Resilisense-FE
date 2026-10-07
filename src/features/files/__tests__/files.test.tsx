import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { COMPANY_ACME } from '@/mocks/data';
import { MOCK_STORAGE_URL } from '@/mocks/files';
import { problem } from '@/mocks/handlers';
import { server } from '@/test/server';
import { renderSignedIn } from '@/test/session';

const png = (name = 'logo.png', size = 2048) => new File([new Uint8Array(size).fill(1)], name, { type: 'image/png' });

/** Picks a file without the input's `accept` filter, as a user dragging any file in would. */
const pick = (file: File) => fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });

describe('logos (M14 §4, US-14-2)', () => {
  it('US-14-2: the owner uploads, replaces and removes the workspace logo', { timeout: 20_000 }, async () => {
    const { user } = await renderSignedIn('/settings/workspace', 'partner@example.com');
    expect(await screen.findByText('No logo yet')).toBeInTheDocument();
    pick(png());
    expect(await screen.findByText('Logo saved', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByRole('img', { name: 'Logo of Verde Advisory' })).toHaveAttribute(
      'src',
      expect.stringContaining(`${MOCK_STORAGE_URL}/download/`),
    );
    await user.click(screen.getByRole('button', { name: 'Remove logo' }));
    expect(await screen.findByText('Logo removed')).toBeInTheDocument();
    expect(await screen.findByText('No logo yet')).toBeInTheDocument();
  });

  it('US-14-2: a company logo is saved and shown in the company header', { timeout: 20_000 }, async () => {
    await renderSignedIn(`/companies/${COMPANY_ACME}/settings`);
    await screen.findByText('No logo yet');
    pick(png('acme.png'));
    expect(await screen.findByText('Logo saved', {}, { timeout: 5000 })).toBeInTheDocument();
    // The settings card and the company header both show it.
    await waitFor(() => expect(screen.getAllByRole('img', { name: 'Logo of Acme Industries' })).toHaveLength(2), {
      timeout: 3000,
    });
  });

  it('US-14-2: admins without workspace:manage see the logo read-only', async () => {
    await renderSignedIn('/settings/workspace');
    expect(await screen.findByText('Only an owner or admin can change the logo.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Choose a file' })).not.toBeInTheDocument();
  });

  it('shows the storage used on the plan page', async () => {
    await renderSignedIn('/settings/plan');
    expect(await screen.findByRole('meter', { name: 'Storage (MB)' })).toHaveAttribute('aria-valuetext', '0 of 1,024');
  });
});

describe('upload failures (M14 §4, US-14-3)', () => {
  const ownerOnWorkspace = () => renderSignedIn('/settings/workspace', 'partner@example.com');

  it('US-14-3: refuses a file over the size limit before uploading it', async () => {
    let declared = false;
    server.use(
      http.post('*/v1/files/uploads', () => {
        declared = true;
        return problem(500, 'internal_error', 'Unexpected');
      }),
    );
    await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(png('huge.png', 3 * 1024 * 1024));
    expect(await screen.findByText('This file is larger than 2 MB.')).toBeInTheDocument();
    expect(declared).toBe(false);
  });

  it('US-14-3: explains a type the API does not allow', async () => {
    await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(new File(['%PDF-1.7'], 'brochure.pdf', { type: 'application/pdf' }));
    expect(await screen.findByText('This type of file is not allowed here.')).toBeInTheDocument();
  });

  it('US-14-3: explains content that does not match its type', async () => {
    await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(png('mismatch.png'));
    expect(await screen.findByText(/content does not match its type/)).toBeInTheDocument();
  });

  it('US-14-3: explains a file the virus scan flagged', { timeout: 15_000 }, async () => {
    await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(png('infected.png'));
    expect(
      await screen.findByText('This file was flagged by the virus scan and cannot be used.', {}, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('No logo yet')).toBeInTheDocument();
  });

  it('US-14-3: offers a retry when the transfer fails', { timeout: 20_000 }, async () => {
    server.use(http.put(`${MOCK_STORAGE_URL}/upload/:id`, () => HttpResponse.error(), { once: true }));
    const { user } = await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(png());
    expect(
      await screen.findByText('The upload did not finish. Check your connection and try again.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Logo saved', {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('US-14-3: says when the plan storage is full', async () => {
    server.use(
      http.post('*/v1/files/uploads', () =>
        problem(403, 'limit_exceeded', 'Storage limit reached', { limit: 'storageMb', max: 1024 }),
      ),
    );
    await ownerOnWorkspace();
    await screen.findByText('No logo yet');
    pick(png());
    expect(
      await screen.findByText("Your plan's storage is full. Delete files or contact your account manager."),
    ).toBeInTheDocument();
  });
});

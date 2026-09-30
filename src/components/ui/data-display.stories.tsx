import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { Button } from './button';
import { ConfirmDialog } from './confirm-dialog';
import { createDataTableColumns, DataTable } from './data-table';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { EmptyState } from './states';
import { StatusPill } from './status-pill';
import { TabNav, TabNavLink, Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = { title: 'UI/Data & navigation', component: StatusPill } satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StatusPills: Story = {
  args: { tone: 'success', label: 'Active' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusPill tone="success" label="Active" />
      <StatusPill tone="neutral" label="Deactivated" />
      <StatusPill tone="warning" label="Expired" />
      <StatusPill tone="info" label="Expires 7 Oct 2026" />
      <StatusPill tone="danger" label="Account disabled" />
    </div>
  ),
};

interface Person {
  id: string;
  name: string;
  role: string;
}
const col = createDataTableColumns<Person>();
const columns = col.columns([
  col.accessor('name', { header: 'Name' }),
  col.accessor('role', { header: 'Role' }),
  col.display({ id: 'status', header: 'Status', cell: () => <StatusPill tone="success" label="Active" /> }),
]);
const people: Person[] = [
  { id: '1', name: 'Olga Owner', role: 'Owner' },
  { id: '2', name: 'Carl Contributor', role: 'Contributor' },
];
const labels = { loading: 'Loading…', errorTitle: "Couldn't load members", retry: 'Try again', loadMore: 'Load more' };
const empty = <EmptyState title="No members yet" description="Invite colleagues to get started." />;

export const Table: Story = {
  args: { tone: 'success', label: '' },
  render: () => (
    <div className="grid gap-8">
      {(['loaded', 'loading', 'empty', 'error'] as const).map((state) => (
        <div key={state} className="rounded-md border border-border bg-surface">
          <DataTable
            label={`Members (${state})`}
            columns={columns}
            data={state === 'loaded' ? people : []}
            getRowId={(p) => p.id}
            isPending={state === 'loading'}
            isError={state === 'error'}
            onRetry={() => undefined}
            hasMore={state === 'loaded'}
            onLoadMore={() => undefined}
            empty={empty}
            labels={labels}
          />
        </div>
      ))}
    </div>
  ),
};

export const TabsExamples: Story = {
  args: { tone: 'success', label: '' },
  render: () => (
    <MemoryRouter initialEntries={['/settings/profile']}>
      <div className="grid gap-8">
        <TabNav label="Settings sections">
          <TabNavLink to="/settings/profile">Profile</TabNavLink>
          <TabNavLink to="/settings/security">Security</TabNavLink>
          <TabNavLink to="/settings/members">Members</TabNavLink>
        </TabNav>
        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Pending invitations</TabsTrigger>
          </TabsList>
          <TabsContent value="members">Members panel</TabsContent>
          <TabsContent value="invitations">Invitations panel</TabsContent>
        </Tabs>
      </div>
    </MemoryRouter>
  ),
};

export const SideSheet: Story = {
  args: { tone: 'success', label: '' },
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Invite people</Button>
      </SheetTrigger>
      <SheetContent closeLabel="Close">
        <SheetHeader>
          <SheetTitle>Invite people</SheetTitle>
          <SheetDescription>Each person gets an email with a link that's valid for 7 days.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p>Form content</p>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Send invitations</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

function ConfirmExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Remove member
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove Carl Contributor from this workspace?"
        description="Carl Contributor (carl@example.com) loses access immediately. Their past answers and files stay."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        closeLabel="Close"
        destructive
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}

export const Confirm: Story = { args: { tone: 'success', label: '' }, render: () => <ConfirmExample /> };

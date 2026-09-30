import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert';
import { Badge } from './badge';
import { EmptyState, ErrorState, PageSkeleton } from './states';
import { Button } from './button';

const meta = { title: 'UI/Feedback', component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3">
      <Alert tone="info">Your session ended. Sign in again to continue.</Alert>
      <Alert tone="success">Password updated.</Alert>
      <Alert tone="warning">3 questions are due tomorrow.</Alert>
      <Alert tone="danger">Email or password is incorrect.</Alert>
    </div>
  ),
};
export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge tone="accent">Recommended</Badge>
      <Badge tone="success">Approved</Badge>
      <Badge tone="warning">Needs review</Badge>
      <Badge tone="danger">Overdue</Badge>
      <Badge tone="info">Info</Badge>
    </div>
  ),
};
export const Empty: Story = {
  render: () => (
    <EmptyState
      title="No projects yet"
      description="Projects group the assessments for one company and reporting year."
      action={<Button>New project</Button>}
    />
  ),
};
export const Error: Story = {
  render: () => (
    <ErrorState
      title="Something went wrong"
      description="The list could not be loaded."
      retryLabel="Try again"
      onRetry={() => {}}
    />
  ),
};
export const Loading: Story = { render: () => <PageSkeleton label="Loading…" /> };

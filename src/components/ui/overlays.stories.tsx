import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = { title: 'UI/Overlays & layout', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CardExample: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Gap analysis</CardTitle>
        <CardDescription>ISO 26000 self-assessment</CardDescription>
      </CardHeader>
      <CardContent>
        <p>214 of 609 key considerations answered.</p>
      </CardContent>
    </Card>
  ),
};
export const Menu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Archive</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
export const DialogExample: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent closeLabel="Close">
        <DialogTitle>Delete project Acme 2026?</DialogTitle>
        <DialogDescription>This removes 214 answers and 38 files.</DialogDescription>
      </DialogContent>
    </Dialog>
  ),
};
export const Avatars: Story = {
  render: () => (
    <div className="flex gap-2">
      <Avatar name="Alice Admin" />
      <Avatar name="Mia" />
      <Avatar name="" />
    </div>
  ),
};

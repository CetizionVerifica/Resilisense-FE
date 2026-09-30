import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './form-field';
import { Input } from './input';

const meta = {
  title: 'UI/FormField',
  component: FormField,
  args: { label: 'Email', children: <Input type="email" placeholder="name@company.com" /> },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Use your work address.' } };
export const WithError: Story = { args: { error: 'Enter a valid email address' } };
export const Disabled: Story = { args: { children: <Input disabled defaultValue="locked@company.com" /> } };

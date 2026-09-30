import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './checkbox';
import { FormField } from './form-field';
import { Select } from './select';
import { Textarea } from './textarea';

const meta = {
  title: 'UI/Inputs',
  component: Select,
  decorators: [(Story) => <div className="grid max-w-sm gap-6">{Story()}</div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SelectField: Story = {
  render: () => (
    <>
      <FormField label="Role" hint="Contributors answer assigned questions.">
        <Select defaultValue="contributor">
          <option value="workspace_admin">Admin</option>
          <option value="contributor">Contributor</option>
          <option value="viewer">Viewer</option>
        </Select>
      </FormField>
      <FormField label="Time zone" error="Choose a time zone">
        <Select defaultValue="">
          <option value="">Select…</option>
          <option>Europe/Bucharest</option>
        </Select>
      </FormField>
      <FormField label="Disabled">
        <Select disabled>
          <option>Owner</option>
        </Select>
      </FormField>
    </>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <>
      <FormField label="Email addresses" hint="Separate addresses with commas or new lines.">
        <Textarea rows={4} defaultValue={'ana@example.com\nbogdan@example.com'} />
      </FormField>
      <FormField label="Email addresses" error="One or more addresses aren't valid email addresses">
        <Textarea rows={3} defaultValue="not-an-email" />
      </FormField>
    </>
  ),
};

export const CheckboxField: Story = {
  render: () => (
    <>
      <Checkbox label="I have read and accept the terms and licence agreement" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="With error" error="Accept the terms to continue" />
      <Checkbox label="Disabled" disabled />
    </>
  ),
};

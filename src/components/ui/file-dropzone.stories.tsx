import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './alert';
import { FileDropzone, UploadProgress } from './file-dropzone';

const meta = {
  title: 'UI/FileDropzone',
  component: FileDropzone,
  args: {
    label: 'Drop a logo here, or browse for one',
    browseLabel: 'Choose a file',
    hint: 'PNG, JPG, SVG · up to 2 MB',
    accept: '.png,.jpg,.jpeg,.svg',
    onFiles: () => undefined,
  },
} satisfies Meta<typeof FileDropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Uploading: Story = {
  args: { disabled: true, children: <UploadProgress label="Uploading logo.png" value={0.6} /> },
};
export const Checking: Story = {
  args: {
    disabled: true,
    children: <p className="text-small text-fg-secondary">Checking logo.png for viruses and file type…</p>,
  },
};
export const Failed: Story = {
  args: {
    children: (
      <Alert tone="danger" className="text-start">
        This file was flagged by the virus scan and cannot be used.
      </Alert>
    ),
  },
};
export const Disabled: Story = { args: { disabled: true } };

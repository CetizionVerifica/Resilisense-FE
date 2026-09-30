import type { StorybookConfig } from '@storybook/react-vite';

/** Design-system workbench (02 §1): every ui/ component has a story; a11y, RTL and dark toolbars. */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;

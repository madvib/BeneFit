import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from '../theme-provider';

const meta: Meta = {
  title: 'Components/Primitives/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Default: StoryObj<typeof ThemeToggle> = {
  render: () => <ThemeToggle />,
};

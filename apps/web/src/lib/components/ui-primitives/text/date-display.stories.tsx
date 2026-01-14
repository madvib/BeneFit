import type { Meta, StoryObj } from '@storybook/react';
import { DateDisplay } from '../../index';

const meta: Meta<typeof DateDisplay> = {
  title: 'Primitives/DateDisplay',
  component: DateDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: ['short', 'medium', 'long', 'full', 'datetime'],
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'time'],
    },
    date: {
      control: 'date',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateDisplay>;

const today = new Date();

export const Short: Story = {
  args: {
    date: today,
    format: 'short',
  },
};

export const Medium: Story = {
  args: {
    date: today,
    format: 'medium',
  },
};

export const Long: Story = {
  args: {
    date: today,
    format: 'long',
  },
};

export const DateTime: Story = {
  args: {
    date: today,
    format: 'datetime',
  },
};

export const CustomOptions: Story = {
  args: {
    date: today,
    options: { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric' },
  },
};

export const InvalidDate: Story = {
  args: {
    date: 'invalid-date-string',
  },
};

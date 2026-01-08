import type { Meta, StoryObj } from '@storybook/react';
import ChatHeader from './chat-header';

const meta: Meta = {
  title: 'Design System/Headers',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-background pt-4 pb-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;

export const AllHeaders: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="container px-4">
        <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
          Chat Header
        </h3>
        <p className="text-muted-foreground text-xs">Used in Coach & Chat views</p>
      </div>
      <div className="border-y">
        <ChatHeader title="AI Coach" />
      </div>
    </div>
  ),
};

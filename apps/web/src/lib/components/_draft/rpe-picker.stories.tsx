import type { Meta, StoryObj } from '@storybook/react';
import RPEPicker from './rpe-picker';
import { useState } from 'react';

const meta: Meta<typeof RPEPicker> = {
  title: 'Drafts/RPEPicker',
  component: RPEPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RPEPicker>;

export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(5);
    return (
      <div className="max-w-md">
        <RPEPicker value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 7,
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

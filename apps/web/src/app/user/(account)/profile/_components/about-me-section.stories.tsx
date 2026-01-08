import type { Meta, StoryObj } from '@storybook/react';
import AboutMeSection from './about-me-section';
import { useState } from 'react';

const meta: Meta<typeof AboutMeSection> = {
  title: 'Pages/Account/Profile/AboutMeSection',
  component: AboutMeSection,
  parameters: {
    layout: 'padded',
  },
  args: {
    aboutMe: '',
    onChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl p-12">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AboutMeSection>;

export const Default: Story = {
  name: 'View Mode (Default)',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [text, setText] = useState(
      "I'm passionate about endurance running and holistic wellness. Previously a sprinter, now transitioning to longer distances. I love tracking my progress and analyzing data to improve my performance.",
    );
    return <AboutMeSection aboutMe={text} onChange={setText} />;
  },
};

export const Empty: Story = {
  name: 'Empty State',
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [text, setText] = useState('');
    return <AboutMeSection aboutMe={text} onChange={setText} />;
  },
};

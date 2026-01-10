import type { Meta, StoryObj } from '@storybook/react';
import LogoLoop from './logo-loop';

const meta: Meta<typeof LogoLoop> = {
  title: 'Primitives/Icons/LogoLoop',
  component: LogoLoop,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof LogoLoop>;

export const Default: Story = {
  render: () => (
    <div className="bg-background py-12">
      <LogoLoop
        logos={[
          {
            alt: 'Apple Health',
            src: '/connection_logos/icons8-apple-fitness-48.png',
          },
          {
            alt: 'Google Fit',
            src: '/connection_logos/google-fit-svgrepo-com.svg',
          },
          {
            alt: 'Strava',
            src: '/connection_logos/strava-svgrepo-com.svg',
          },
          {
            alt: 'Fitbit',
            src: '/connection_logos/icons8-fitbit-48.png',
          },
          {
            alt: 'WHOOP',
            src: '/connection_logos/whoop.svg',
          },
        ]}
      />
    </div>
  ),
};

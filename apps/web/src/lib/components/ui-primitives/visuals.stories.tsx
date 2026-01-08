import type { Meta, StoryObj } from '@storybook/react';
import Aurora from './backgrounds/aurora';
import LogoLoop from './icons/logo-loop';

const meta: Meta = {
  title: 'Components/Primitives/Visuals',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const AuroraBackground: StoryObj<typeof Aurora> = {
  render: () => (
    <div className="relative h-96 w-full overflow-hidden bg-black">
      <Aurora colorStops={['#FF0000', '#00FF00', '#0000FF']} speed={0.5} />
      <div className="relative z-10 flex h-full items-center justify-center text-2xl font-bold text-white">
        Aurora Effect
      </div>
    </div>
  ),
};

export const LogoInfiniteLoop: StoryObj<typeof LogoLoop> = {
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
  parameters: {
    layout: 'padded',
  },
};

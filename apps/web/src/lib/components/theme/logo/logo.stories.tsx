import type { Meta, StoryObj } from '@storybook/react';
import { BeneLogo } from './logo';

const meta: Meta = {
  title: 'Components/Primitives/Logo',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj<typeof BeneLogo> = {
  render: () => <BeneLogo />,
};

export const MobileOptimized: StoryObj<typeof BeneLogo> = {
  render: () => <BeneLogo hideLabelOnMobile={true} />,
};

export const CustomLink: StoryObj<typeof BeneLogo> = {
  render: () => <BeneLogo href="/custom-link" />,
};

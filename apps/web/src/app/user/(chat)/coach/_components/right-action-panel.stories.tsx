import type { Meta, StoryObj } from '@storybook/react';
import RightActionPanel from './right-action-panel';

const meta: Meta<typeof RightActionPanel> = {
  title: 'Pages/Coach/RightActionPanel',
  component: RightActionPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="bg-background flex h-screen w-full justify-end">
        <div className="relative h-full w-80 border-l">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RightActionPanel>;

// --- Mock Data ---

import { mockRecommendations } from '@/lib/testing/fixtures';

const MOCK_RECOMMENDATIONS = mockRecommendations;

// --- Stories ---

export const Default: Story = {
  name: 'Recommendations List',
  args: {
    isOpen: true,
    onClose: () => console.log('Close panel'),
    recommendations: MOCK_RECOMMENDATIONS,
    onGenerateSummary: () => console.log('Generate summary clicked'),
    isGeneratingSummary: false,
  },
};

export const GeneratingSummary: Story = {
  name: 'Generating Summary',
  args: {
    isOpen: true,
    onClose: () => console.log('Close panel'),
    recommendations: MOCK_RECOMMENDATIONS,
    onGenerateSummary: () => console.log('Generate summary clicked'),
    isGeneratingSummary: true,
  },
};

export const Empty: Story = {
  name: 'Empty State',
  args: {
    isOpen: true,
    onClose: () => console.log('Close panel'),
    recommendations: [],
    onGenerateSummary: () => console.log('Generate summary clicked'),
    isGeneratingSummary: false,
  },
};

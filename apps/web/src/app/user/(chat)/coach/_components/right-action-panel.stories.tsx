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

const MOCK_RECOMMENDATIONS = [
  {
    id: '1',
    title: 'Increase Protein Intake',
    description: 'Based on your goals, aim for 150g daily',
    category: 'Nutrition',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Add Mobility Work',
    description: '10 min daily hip mobility routine',
    category: 'Flexibility',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Progressive Overload',
    description: 'Increase weight by 5% this week',
    category: 'Workout',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Sleep Optimization',
    description: 'Aim for 8 hours to improve recovery',
    category: 'Wellness',
    createdAt: new Date().toISOString(),
  },
];

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

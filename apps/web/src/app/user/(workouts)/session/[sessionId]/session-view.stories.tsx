import type { Meta, StoryObj } from '@storybook/react';
import SessionView from './session-view';
import AchievementPopup from '../../_components/achievement-popup';
import PerformanceForm from '../../_components/performance-form';
import { mockPushIntensitySession, mockDailyWorkout } from '@/lib/testing/fixtures/workouts';

const meta: Meta<typeof SessionView> = {
  title: 'Features/Workouts/SessionView',
  component: SessionView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj<typeof SessionView> = {
  args: {
    session: mockPushIntensitySession,
    onComplete: (perf) => console.log('Complete', perf),
    onAbort: () => console.log('Abort'),
  },
};

export const AchievementPopupStory: StoryObj<typeof AchievementPopup> = {
  render: (args) => <AchievementPopup {...args} />,
  args: {
    isOpen: true,
    achievements: [
      {
        id: '1',
        name: 'Peak Intensity Reached',
        description: 'You maintained an RPE of 9 for over 5 minutes.',
      },
      {
        id: '2',
        name: 'Form Excellence',
        description: 'Elite movement patterns detected across all sets.',
      },
    ],
    onClose: () => console.log('Close'),
  },
  name: 'Showcase/Achievement Popup',
};

export const PerformanceFormStory: StoryObj<typeof PerformanceForm> = {
  render: (args) => (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <PerformanceForm {...args} />
      </div>
    </div>
  ),
  args: {
    workout: mockDailyWorkout,
    onSubmit: (data) => console.log('Submit', data),
    isLoading: false,
  },
  name: 'Showcase/Performance Form',
};

import type { Meta, StoryObj } from '@storybook/react';
import { mockUserStats } from '@/lib/testing/fixtures';
import {
  StatisticsSection,
  ProgressChart,
  AchievementPopup,
} from './index';

const meta: Meta = {
  title: 'Components/Fitness/Progress',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const ProfileStats: StoryObj = {
  name: 'Profile Stats',
  render: () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="max-w-2xl">
        <StatisticsSection stats={mockUserStats} />
      </div>
      <div className="max-w-2xl">
        <ProgressChart
          data={[
            { date: 'Mon', value: 5 },
            { date: 'Tue', value: 8 },
            { date: 'Wed', value: 3 },
            { date: 'Thu', value: 10 },
            { date: 'Fri', value: 7 },
            { date: 'Sat', value: 12 },
            { date: 'Sun', value: 4 },
          ]}
        />
      </div>
    </div>
  ),
};

export const AchievementPopupStory: StoryObj<typeof AchievementPopup> = {
  name: 'Achievement Popup',
  render: () => (
    <div className="flex h-150 w-full items-center justify-center bg-accent/20 p-8">
      <AchievementPopup
        isOpen={true}
        onClose={() => console.log('Close')}
        achievements={[
          {
            id: '1',
            name: 'Early Riser',
            description: 'Completed a workout before 6 AM',
          },
          {
            id: '2',
            name: 'Strength Master',
            description: 'Lifted 1000kg total volume',
          },
        ]}
      />
    </div>
  ),
};

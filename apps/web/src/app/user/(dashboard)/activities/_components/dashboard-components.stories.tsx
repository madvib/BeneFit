import type { Meta, StoryObj } from '@storybook/react';
import ProgressChart from './progress-chart';
import StatisticsSection from '../../../(account)/profile/_components/statistics-section';

const meta: Meta = {
  title: 'Pages/Dashboard/Components',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

// Progress Chart Stories
export const ProgressChartWithData: StoryObj<typeof ProgressChart> = {
  name: 'Progress Chart - With Data',
  render: () => (
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
  ),
};

export const ProgressChartEmpty: StoryObj<typeof ProgressChart> = {
  name: 'Progress Chart - Empty Week',
  render: () => (
    <div className="max-w-2xl">
      <ProgressChart
        data={[
          { date: 'Mon', value: 0 },
          { date: 'Tue', value: 0 },
          { date: 'Wed', value: 0 },
          { date: 'Thu', value: 0 },
          { date: 'Fri', value: 0 },
          { date: 'Sat', value: 0 },
          { date: 'Sun', value: 0 },
        ]}
      />
    </div>
  ),
};

// Statistics Section Stories
export const StatisticsWithData: StoryObj<typeof StatisticsSection> = {
  name: 'Statistics Section - Active User',
  render: () => (
    <div className="max-w-2xl">
      <StatisticsSection
        stats={{
          totalWorkouts: 127,
          totalMinutes: 5430,
          totalVolume: 125_000,
          lastWorkoutDate: '2026-01-07',
          daysSinceLastWorkout: 0,
          currentStreak: 12,
          longestStreak: 45,
          streakActive: true,
          achievements: [
            { id: '1', name: 'First Workout', earnedAt: '2025-06-15' },
            { id: '2', name: '10 Day Streak', earnedAt: '2025-12-20' },
            { id: '3', name: '100 Workouts', earnedAt: '2026-01-01' },
          ],
        }}
      />
    </div>
  ),
};

export const StatisticsNewUser: StoryObj<typeof StatisticsSection> = {
  name: 'Statistics Section - New User',
  render: () => (
    <div className="max-w-2xl">
      <StatisticsSection
        stats={{
          totalWorkouts: 3,
          totalMinutes: 120,
          totalVolume: 2500,
          lastWorkoutDate: '2026-01-06',
          daysSinceLastWorkout: 1,
          currentStreak: 2,
          longestStreak: 2,
          streakActive: false,
          achievements: [],
        }}
      />
    </div>
  ),
};

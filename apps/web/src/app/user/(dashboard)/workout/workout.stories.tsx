import type { Meta, StoryObj } from '@storybook/react';
import SessionView from './[sessionId]/session-view';

const MOCK_WORKOUT = {
  type: 'Strength',
  activities: [
    {
      type: 'Warm Up',
      durationMinutes: 5,
      instructions: 'Light jogging and dynamic stretching.',
    },
    {
      type: 'Bench Press',
      durationMinutes: 10,
      instructions: '4 sets of 8-10 reps. Rest 90s between sets.',
    },
    {
      type: 'Squats',
      durationMinutes: 15,
      instructions: '4 sets of 8-10 reps. Keep back straight.',
    },
    {
      type: 'Cool Down',
      durationMinutes: 5,
      instructions: 'Static stretching and foam rolling.',
    },
  ],
};

const meta: Meta = {
  title: 'Features/Workout',
  component: SessionView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const ActiveSession: StoryObj<typeof SessionView> = {
  render: () => (
    <SessionView
      workout={MOCK_WORKOUT}
      onComplete={() => alert('Workout Finished!')}
      onBack={() => alert('Back clicked')}
    />
  ),
};

export const ShortSession: StoryObj<typeof SessionView> = {
  render: () => (
    <SessionView
      workout={{
        type: 'HIIT',
        activities: [
          { type: 'Sprint', durationMinutes: 1, instructions: 'Max effort.' },
          { type: 'Rest', durationMinutes: 1, instructions: 'Walk it off.' },
        ],
      }}
      onComplete={() => alert('Workout Finished!')}
      onBack={() => alert('Back clicked')}
    />
  ),
};

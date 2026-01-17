import type { Meta, StoryObj } from '@storybook/react';

import SessionView from './session-view';

// WorkoutSession is UI state, not API response - keep as local fixture
interface WorkoutSession {
  id: string;
  workoutType: string;
  state: 'in_progress' | 'paused' | 'completed';
  currentActivityIndex: number;
  completedActivities: any[];
  totalPausedSeconds: number;
  configuration: any;
  participants: any[];
  activityFeed: any[];
  activities: any[];
}

const mockSession: WorkoutSession = {
  id: 'session-123',
  workoutType: 'strength',
  state: 'in_progress',
  currentActivityIndex: 0,
  completedActivities: [],
  totalPausedSeconds: 0,
  configuration: {
    isMultiplayer: false,
    isPublic: false,
    maxParticipants: 1,
    allowSpectators: false,
    enableChat: false,
    enableVoiceAnnouncements: true,
    showOtherParticipantsProgress: false,
    autoAdvanceActivities: false,
  },
  participants: [],
  activityFeed: [],
  activities: [
    {
      name: 'Dynamic Warmup',
      type: 'warmup',
      order: 0,
      duration: 10,
      instructions: ['Focus on shoulder mobility and light chest activation.'],
      structure: {
        exercises: [
          {
            name: 'Shoulder Dislocates',
            sets: 2,
            reps: 15,
            rest: 30,
            notes: 'Use a resistance band or PVC pipe.',
          },
          { name: 'Pushups', sets: 2, reps: 10, rest: 60, notes: 'Slow and controlled' },
        ],
      },
    },
    {
      name: 'Main Strength',
      type: 'main',
      order: 1,
      duration: 35,
      instructions: ['Execute compound movements with explosive intent.'],
      structure: {
        exercises: [
          {
            name: 'Bench Press',
            sets: 4,
            reps: 8,
            weight: 80,
            rest: 90,
            notes: 'Focus on leg drive',
          },
          { name: 'Overhead Press', sets: 3, reps: 10, weight: 45, rest: 90 },
        ],
      },
    },
    {
      name: 'Cooldown',
      type: 'cooldown',
      order: 2,
      duration: 10,
      instructions: ['Static stretching and parasympathetic breathing.'],
      structure: {
        exercises: [{ name: 'Pec Stretch', sets: 2, reps: '30s', rest: 15 }],
      },
    },
  ],
};

const meta: Meta<typeof SessionView> = {
  title: 'Features/Active Session',
  component: SessionView,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Showcase: StoryObj<typeof SessionView> = {
  render: () => (
    <SessionView
      session={mockSession}
      onComplete={(perf) => console.log('Complete', perf)}
      onAbort={() => console.log('Abort')}
    />
  ),
};


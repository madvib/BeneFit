import { profile } from '@bene/react-api-client';
import type { Achievement } from '@bene/shared';

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'Early Bird',
    description: 'Completed a workout before 6 AM',
    earnedAt: '2025-12-20T05:45:00Z',
  },
  {
    id: 'ach-2',
    name: 'Consistency King',
    description: 'Worked out 5 days in a row',
    earnedAt: '2026-01-05T10:00:00Z',
  },
];

// Strictly typed API response
export const mockUserProfile: profile.GetProfileResponse = {
  userId: 'user-123',
  displayName: 'John Doe',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Fitness enthusiast',
  location: 'San Francisco, CA',
  experienceLevel: 'intermediate',
  primaryGoal: 'strength',
  totalWorkouts: 42,
  totalMinutes: 2500,
  totalAchievements: 5,
  currentStreak: 3,
  preferences: {
    measurementSystem: 'imperial',
  },
};

export const mockUserStats: profile.GetUserStatsResponse = {
  totalWorkouts: 42,
  totalMinutes: 2500,
  totalVolume: 15_400,
  lastWorkoutDate: '2026-01-05T10:00:00Z',
  daysSinceLastWorkout: 2,
  currentStreak: 3,
  longestStreak: 12,
  streakActive: true,
  achievements: mockAchievements,
};

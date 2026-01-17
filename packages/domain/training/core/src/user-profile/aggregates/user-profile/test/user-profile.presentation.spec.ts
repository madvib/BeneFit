import { describe, it, expect } from 'vitest';
import { UserProfileSchema, toUserProfileSchema } from '../user-profile.presentation.js';
import { createUserProfileFixture } from './user-profile.fixtures.js';
import { createUserStatsFixture, createUserPreferencesFixture } from '../../../value-objects/index.js';

describe('UserProfile Presentation', () => {
  it('should map valid profile to presentation DTO', () => {

    const profile = createUserProfileFixture({
      userId: 'user-123',
      displayName: 'Test User',
      timezone: 'UTC',
      stats: createUserStatsFixture({
        lastWorkoutDate: undefined,
        currentStreak: 0,
        totalWorkouts: 0,
        totalMinutes: 0
      }),
      preferences: createUserPreferencesFixture({
        coaching: {
          checkInFrequency: 'daily',
          tone: 'motivational',
          proactiveAdvice: true,
          celebrateWins: true,
          receiveFormTips: true
        }
      })
    });

    const presentation = toUserProfileSchema(profile);
    const result = UserProfileSchema.safeParse(presentation);

    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.userId).toBe('user-123');
    expect(presentation.displayName).toBe('Test User');
    expect(presentation.preferences).toBeDefined();
    expect(presentation.stats).toBeDefined();
    expect(presentation.streakActive).toBe(false); // New profile, no streak
    expect(presentation.daysSinceLastWorkout).toBeNull();
    expect(presentation.averageWorkoutDuration).toBe(0);
    expect(presentation.achievementsCount).toBe(profile.stats.achievements.length);
    expect(presentation.shouldReceiveCheckIn).toBe(true); // Default to true if never worked out and not "never" frequency
  });
});

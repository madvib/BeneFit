import { z } from 'zod';
import { Result, type UseCase } from '@bene/shared';
import { UserProfile } from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetUserStatsRequest type instead */
export interface GetUserStatsRequest_Deprecated {
  userId: string;
}

// Zod schema for request validation
export const GetUserStatsRequestSchema = z.object({
  userId: z.string(),
});

// Zod inferred type with original name
export type GetUserStatsRequest = z.infer<typeof GetUserStatsRequestSchema>;

// Zod schema for response validation
const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  earnedAt: z.date(),
});

export const GetUserStatsResponseSchema = z.object({
  totalWorkouts: z.number(),
  totalMinutes: z.number(),
  totalVolume: z.number(),
  currentStreak: z.number(),
  longestStreak: z.number(),
  lastWorkoutDate: z.date().optional(),
  achievements: z.array(AchievementSchema),
  streakActive: z.boolean(),
  daysSinceLastWorkout: z.number().nullable(),
});

// Zod inferred type with original name
export type GetUserStatsResponse = z.infer<typeof GetUserStatsResponseSchema>;

export class GetUserStatsUseCase implements UseCase<
  GetUserStatsRequest,
  GetUserStatsResponse
> {
  constructor(private profileRepository: UserProfileRepository) {}

  async execute(request: GetUserStatsRequest): Promise<Result<GetUserStatsResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }

    const profile = profileResult.value;
    const isStreakActive = this.isStreakActive(profile);
    const daysSince = this.getDaysSinceLastWorkout(profile);

    return Result.ok({
      totalWorkouts: profile.stats.totalWorkouts,
      totalMinutes: profile.stats.totalMinutes,
      totalVolume: profile.stats.totalVolume,
      currentStreak: profile.stats.currentStreak,
      longestStreak: profile.stats.longestStreak,
      lastWorkoutDate: profile.stats.lastWorkoutDate,
      achievements: (
        profile.stats.achievements as Array<{
          id: string;
          name: string;
          earnedAt: Date;
        }>
      ).map((a) => ({
        id: a.id,
        name: a.name,
        earnedAt: a.earnedAt,
      })),
      streakActive: isStreakActive,
      daysSinceLastWorkout: daysSince,
    });
  }

  private isStreakActive(profile: UserProfile): boolean {
    if (!profile.stats.lastWorkoutDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = new Date(profile.stats.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    const daysSince = Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24),
    );

    return daysSince <= 1;
  }

  private getDaysSinceLastWorkout(profile: UserProfile): number | null {
    if (!profile.stats.lastWorkoutDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = new Date(profile.stats.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    return Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetUserStatsResponse type instead */
export interface GetUserStatsResponse_Deprecated {
  totalWorkouts: number;
  totalMinutes: number;
  totalVolume: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: Date;
  achievements: Array<{
    id: string;
    name: string;
    earnedAt: Date;
  }>;
  streakActive: boolean;
  daysSinceLastWorkout: number | null;
}

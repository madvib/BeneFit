export interface UserStats {
  // Workout metrics
  totalWorkouts: number;
  totalMinutes: number;
  totalVolume: number; // kg lifted

  // Streaks
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastWorkoutDate?: Date;

  // Achievements
  achievements: Achievement[];

  // Milestones
  firstWorkoutDate: Date;
  joinedAt: Date;
}

export type AchievementType =
  | 'first_workout'
  | 'streak_7'
  | 'streak_30'
  | 'pr_strength'
  | 'pr_distance'
  | '100_workouts'
  | 'plan_completed';

interface AchievementData {
  id: string;
  type: AchievementType;
  name: string;
  description: string;
  earnedAt: Date;
  iconUrl?: string;
}
export type Achievement = Readonly<AchievementData>;

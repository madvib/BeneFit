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

interface AchievementData {
  id: string;
  type: string; // "first_workout", "10_workouts", "30_day_streak", etc.
  name: string;
  description: string;
  earnedAt: Date;
  iconUrl?: string;
}
export type Achievement = Readonly<AchievementData>;

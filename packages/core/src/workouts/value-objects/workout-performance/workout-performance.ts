export interface HeartRateData {
  average?: number;
  max?: number;
  zones?: Record<string, number>; // Time in seconds per zone
}

export interface ExercisePerformance {
  name: string;
  setsCompleted: number;
  setsPlanned: number;
  reps?: number[]; // Per set
  weight?: number[]; // Per set (kg)
  distance?: number; // For cardio (km)
  duration?: number; // For time-based exercises (seconds)
}

export interface ActivityPerformance {
  activityType: 'warmup' | 'main' | 'cooldown';
  completed: boolean;
  durationMinutes: number;
  notes?: string;

  // For interval-based activities
  intervalsCompleted?: number;
  intervalsPlanned?: number;

  // For exercise-based activities
  exercises?: ExercisePerformance[];
}

export type EnergyLevel = 'low' | 'medium' | 'high';
export type DifficultyRating = 'too_easy' | 'just_right' | 'too_hard';

export interface WorkoutPerformance {
  // Timing
  startedAt: Date;
  completedAt: Date;
  durationMinutes: number;

  // Activity completion
  activities: ActivityPerformance[];

  // Subjective metrics
  perceivedExertion: number; // RPE scale 1-10
  energyLevel: EnergyLevel;
  enjoyment: number; // 1-5 stars
  difficultyRating: DifficultyRating;

  // Physical metrics (optional, from wearables)
  heartRate?: HeartRateData;
  caloriesBurned?: number;

  // Notes and feedback
  notes?: string;
  injuries?: string[]; // Any issues that came up
  modifications?: string[]; // Changes made during workout
}


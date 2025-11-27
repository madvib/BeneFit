export interface IntervalProgress {
  intervalNumber: number;
  totalIntervals: number;
  intervalDurationSeconds: number;
  elapsedSeconds: number;
  isResting: boolean; // True if in rest period
}

export interface ExerciseProgress {
  exerciseName: string;
  currentSet: number;
  totalSets: number;
  repsCompleted?: number;
  targetReps?: number;
  weightUsed?: number;
  restTimeRemaining?: number; // Seconds
}

interface LiveActivityProgressData {
  activityType: 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';
  activityIndex: number;
  totalActivities: number;

  // For interval-based activities
  intervalProgress?: IntervalProgress;

  // For exercise-based activities
  exerciseProgress?: ExerciseProgress[];

  // Timing
  activityStartedAt: Date;
  elapsedSeconds: number;
  estimatedRemainingSeconds?: number;
}

export type LiveActivityProgress = Readonly<LiveActivityProgressData>;

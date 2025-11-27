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

export interface LiveActivityProgress {
  activityType: 'warmup' | 'main' | 'cooldown';
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
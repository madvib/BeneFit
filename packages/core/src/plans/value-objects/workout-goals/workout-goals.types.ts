export interface DistanceGoal {
  value: number;
  unit: 'meters' | 'km' | 'miles';
  pace?: {
    min: number;
    max: number;
    target?: number;
  };
}

export interface DurationGoal {
  value: number;
  intensity?: 'easy' | 'moderate' | 'hard' | 'max';
  heartRateZone?: 1 | 2 | 3 | 4 | 5;
}

export interface VolumeGoal {
  totalSets: number;
  totalReps: number;
  targetWeight?: 'light' | 'moderate' | 'heavy' | number;
}

export interface CompletionCriteria {
  mustComplete: boolean;
  minimumEffort?: number;
  autoVerifiable: boolean;
}

export interface WorkoutGoals {
  distance?: DistanceGoal;
  duration?: DurationGoal;
  volume?: VolumeGoal;
  completionCriteria: CompletionCriteria;
}

import { WorkoutGoals } from './workout-goals.types.js';

// Query methods
export function hasDistanceGoal(goals: WorkoutGoals): boolean {
  return goals.distance !== undefined;
}

export function hasDurationGoal(goals: WorkoutGoals): boolean {
  return goals.duration !== undefined;
}

export function hasVolumeGoal(goals: WorkoutGoals): boolean {
  return goals.volume !== undefined;
}

export function isCompletionRequired(goals: WorkoutGoals): boolean {
  return goals.completionCriteria.mustComplete;
}

export function hasMinimumEffort(goals: WorkoutGoals): boolean {
  return goals.completionCriteria.minimumEffort !== undefined;
}

export function isAutoVerifiable(goals: WorkoutGoals): boolean {
  return goals.completionCriteria.autoVerifiable;
}

export function getMinimumEffort(goals: WorkoutGoals): number {
  return goals.completionCriteria.minimumEffort || 0;
}

export function getGoalType(goals: WorkoutGoals): 'distance' | 'duration' | 'volume' | 'none' {
  if (hasDistanceGoal(goals)) return 'distance';
  if (hasDurationGoal(goals)) return 'duration';
  if (hasVolumeGoal(goals)) return 'volume';
  return 'none';
}

export function getDistanceValue(goals: WorkoutGoals): number | null {
  if (!hasDistanceGoal(goals)) return null;
  return goals.distance!.value;
}

export function getDurationValue(goals: WorkoutGoals): number | null {
  if (!hasDurationGoal(goals)) return null;
  return goals.duration!.value;
}

export function getVolumeSets(goals: WorkoutGoals): number | null {
  if (!hasVolumeGoal(goals)) return null;
  return goals.volume!.totalSets;
}

export function getVolumeReps(goals: WorkoutGoals): number | null {
  if (!hasVolumeGoal(goals)) return null;
  return goals.volume!.totalReps;
}

// Transformation methods (immutable)
export function withDistanceGoal(goals: WorkoutGoals, distance: number, unit: 'meters' | 'km' | 'miles'): WorkoutGoals {
  return {
    ...goals,
    distance: { value: distance, unit },
    duration: undefined,
    volume: undefined
  };
}

export function withDurationGoal(goals: WorkoutGoals, duration: number, intensity?: 'easy' | 'moderate' | 'hard' | 'max'): WorkoutGoals {
  return {
    ...goals,
    duration: { value: duration, intensity },
    distance: undefined,
    volume: undefined
  };
}

export function withVolumeGoal(goals: WorkoutGoals, totalSets: number, totalReps: number): WorkoutGoals {
  return {
    ...goals,
    volume: { totalSets, totalReps },
    distance: undefined,
    duration: undefined
  };
}

export function withUpdatedCompletionCriteria(goals: WorkoutGoals, criteria: {
  mustComplete?: boolean;
  minimumEffort?: number;
  autoVerifiable?: boolean;
}): WorkoutGoals {
  return {
    ...goals,
    completionCriteria: {
      ...goals.completionCriteria,
      ...criteria
    }
  };
}

export function withMinimumEffort(goals: WorkoutGoals, effort: number): WorkoutGoals {
  return {
    ...goals,
    completionCriteria: {
      ...goals.completionCriteria,
      minimumEffort: effort
    }
  };
}

export function withAutoVerification(goals: WorkoutGoals, autoVerify: boolean): WorkoutGoals {
  return {
    ...goals,
    completionCriteria: {
      ...goals.completionCriteria,
      autoVerifiable: autoVerify
    }
  };
}

// Calculation methods
export function getExpectedWorkoutTime(goals: WorkoutGoals, avgPace?: number): number {
  // Estimate workout time in minutes based on goals
  if (hasDistanceGoal(goals)) {
    const dist = goals.distance!.value;
    const unit = goals.distance!.unit;
    let distanceInKm = dist;
    
    if (unit === 'miles') {
      distanceInKm = dist * 1.60934;
    } else if (unit === 'meters') {
      distanceInKm = dist / 1000;
    }
    
    if (avgPace) {
      // avgPace in minutes per km
      return distanceInKm * avgPace;
    }
    return distanceInKm * 8; // Default 8 min/km
  }
  
  if (hasDurationGoal(goals)) {
    return goals.duration!.value;
  }
  
  // For volume, rough estimate
  if (hasVolumeGoal(goals)) {
    return goals.volume!.totalSets * 3; // 3 minutes per set on average
  }
  
  return 30; // Default
}

export function getGoalDifficulty(goals: WorkoutGoals): 'easy' | 'moderate' | 'hard' | 'max' {
  if (hasDistanceGoal(goals)) {
    const dist = goals.distance!.value;
    if (dist < 5000) return 'easy';
    if (dist < 15000) return 'moderate';
    return 'hard';
  }
  
  if (hasDurationGoal(goals)) {
    const duration = goals.duration!.value;
    if (duration < 30) return 'easy';
    if (duration < 60) return 'moderate';
    return 'hard';
  }
  
  if (hasVolumeGoal(goals)) {
    const volume = goals.volume!.totalSets * goals.volume!.totalReps;
    if (volume < 30) return 'easy';
    if (volume < 100) return 'moderate';
    return 'hard';
  }
  
  return 'moderate';
}

// Validation helpers
export function isValidForBeginner(goals: WorkoutGoals): boolean {
  if (hasDistanceGoal(goals)) {
    const dist = goals.distance!.value;
    const unit = goals.distance!.unit;
    if (unit === 'miles') return dist <= 3;
    if (unit === 'km') return dist <= 5;
    return dist <= 5000; // meters
  }
  
  if (hasDurationGoal(goals)) {
    return goals.duration!.value <= 45;
  }
  
  if (hasVolumeGoal(goals)) {
    const volume = goals.volume!.totalSets * goals.volume!.totalReps;
    return volume <= 50;
  }
  
  return true; // Default is valid
}

export function isValidForAdvanced(goals: WorkoutGoals): boolean {
  if (hasDistanceGoal(goals)) {
    const dist = goals.distance!.value;
    const unit = goals.distance!.unit;
    if (unit === 'miles') return dist >= 10;
    if (unit === 'km') return dist >= 15;
    return dist >= 15000; // meters
  }
  
  if (hasDurationGoal(goals)) {
    return goals.duration!.value >= 60;
  }
  
  if (hasVolumeGoal(goals)) {
    const volume = goals.volume!.totalSets * goals.volume!.totalReps;
    return volume >= 150;
  }
  
  return true;
}

// Display helpers
export function getGoalDescription(goals: WorkoutGoals): string {
  if (hasDistanceGoal(goals)) {
    const { value, unit } = goals.distance!;
    return `${value} ${unit}`;
  }
  
  if (hasDurationGoal(goals)) {
    return `${goals.duration!.value} minutes`;
  }
  
  if (hasVolumeGoal(goals)) {
    const { totalSets, totalReps } = goals.volume!;
    return `${totalSets} sets x ${totalReps} reps`;
  }
  
  return 'No goal specified';
}

export function getIntensityDescription(goals: WorkoutGoals): string {
  if (hasDurationGoal(goals) && goals.duration!.intensity) {
    return goals.duration!.intensity;
  }
  
  if (hasDistanceGoal(goals) && goals.distance!.pace) {
    const pace = goals.distance!.pace;
    return `pace: ${pace.min}-${pace.max}`;
  }
  
  return 'moderate';
}

// Equality
export function equals(goals: WorkoutGoals, other: WorkoutGoals): boolean {
  if (!other) return false;

  return (
    JSON.stringify(goals.distance) === JSON.stringify(other.distance) &&
    JSON.stringify(goals.duration) === JSON.stringify(other.duration) &&
    JSON.stringify(goals.volume) === JSON.stringify(other.volume) &&
    JSON.stringify(goals.completionCriteria) === JSON.stringify(other.completionCriteria)
  );
}
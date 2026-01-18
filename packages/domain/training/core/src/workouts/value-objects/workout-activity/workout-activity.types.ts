// workout-activity.types.ts
import { CreateView } from '@bene/shared';
import { ActivityStructure } from '../activity-structure/activity-structure.types.js';

export type ActivityType = 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';

interface WorkoutActivityData {
  name: string;
  type: ActivityType;
  order: number;
  structure?: ActivityStructure;
  instructions?: readonly string[];
  distance?: number; // meters
  duration?: number; // minutes
  pace?: string; // e.g., "easy", "moderate", "5:30/km"
  videoUrl?: string;
  equipment?: readonly string[];
  alternativeExercises?: readonly string[];
}

// The core data structure is an immutable interface
export type WorkoutActivity = Readonly<WorkoutActivityData>;


export type WorkoutActivityView = CreateView<
  WorkoutActivity,
  never,
  {
    estimatedDuration: number;
    estimatedCalories: number;
    shortDescription: string;
    detailedDescription: string;
    instructionsList: string[];
    requiresEquipment: boolean;
    equipmentList: string[];
    // Type helpers
    isWarmup: boolean;
    isCooldown: boolean;
    isMainActivity: boolean;
    isIntervalBased: boolean;
    isCircuit: boolean;
  }
>;

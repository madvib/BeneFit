import { CreateView, serializeForView } from '@bene/shared';
import { ActivityStructureView, toActivityStructureView } from '../activity-structure/index.js';
import * as Queries from './workout-activity.queries.js';
import { WorkoutActivity } from './workout-activity.types.js';


/**
 * 3. VIEW TYPES
 */
export type WorkoutActivityView = CreateView<
  WorkoutActivity,
  'structure',
  {
    structure?: ActivityStructureView;
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


export function toWorkoutActivityView(activity: WorkoutActivity): WorkoutActivityView {
  const base = serializeForView(activity)
  return {
    ...base,
    structure: activity.structure ? toActivityStructureView(activity.structure) : undefined,
    estimatedDuration: Queries.getEstimatedDuration(activity),
    estimatedCalories: Queries.getEstimatedCalories(activity),
    shortDescription: Queries.getShortDescription(activity),
    detailedDescription: Queries.getDetailedDescription(activity),
    instructionsList: Queries.getInstructionsList(activity),
    requiresEquipment: Queries.activityRequiresEquipment(activity),
    equipmentList: Queries.getEquipmentList(activity),
    isWarmup: Queries.isWarmup(activity),
    isCooldown: Queries.isCooldown(activity),
    isMainActivity: Queries.isMainActivity(activity),
    isIntervalBased: Queries.isActivityIntervalBased(activity),
    isCircuit: Queries.isCircuit(activity),
  };
}

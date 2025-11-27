// This file just exports the types for ActivityStructure
// The implementation is separated into factory and commands files
export type { ActivityStructure, ActivityStructureValidation, Exercise, IntensityLevel } from './activity-structure.types.js';
export { createActivityStructure, createActivityStructureWithExercises, createEmptyActivityStructure, createActivityStructureWithIntervals } from './activity-structure.factory.js';
export type { ActivityStructureProps } from './activity-structure.factory.js';
export * as ActivityStructureCommands from './activity-structure.commands.js';
export {
  isIntervalBased,
  isExerciseBased,
  isEmpty,
  getTotalDuration,
  withAdjustedIntensity,
  requiresEquipment,
  getDescription
} from './activity-structure.commands.js';

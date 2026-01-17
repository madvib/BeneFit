// /**
//  * PARALLEL IMPLEMENTATION: Plain TypeScript (no Zod)
//  * 
//  * This is a comparison implementation to explore removing Zod from the entity layer.
//  * Compare with fitness-plan.presentation.ts (Zod-based version).
//  */

// import type { TrainingConstraints } from '@/shared/value-objects/training-constraints/training-constraints.types.js';
// import type { PlanGoals, ProgressionStrategy, PlanPosition } from '@/fitness-plan/value-objects/index.js';
// import type { WeeklySchedule } from '../weekly-schedule/weekly-schedule.types.js';
// import type { WorkoutTemplate } from '../workout-template/workout-template.types.js';
// import type { FitnessPlan } from './fitness-plan.types.js';
// import * as Queries from './fitness-plan.queries.js';

// // ============================================
// // Plain TypeScript Types (instead of Zod schemas)
// // ============================================

// export type PlanType =
//   | 'event_training'
//   | 'habit_building'
//   | 'strength_program'
//   | 'general_fitness';

// export type PlanStatus =
//   | 'draft'
//   | 'active'
//   | 'paused'
//   | 'completed'
//   | 'abandoned';

// /**
//  * API presentation type for FitnessPlan
//  * This is what gets sent over the wire (JSON-serialized)
//  */
// export interface FitnessPlanPresentation {
//   id: string;
//   userId: string;
//   title: string;
//   description: string;
//   planType: PlanType;
//   goals: PlanGoals & {
//     targetDate?: string; // ISO string instead of Date
//   };
//   progression: ProgressionStrategy;
//   constraints: TrainingConstraints;
//   weeks: WeeklySchedule[];
//   status: PlanStatus;
//   currentPosition: PlanPosition;
//   startDate: string; // ISO string
//   endDate?: string; // ISO string
//   createdAt: string; // ISO string
//   updatedAt?: string; // ISO string

//   // Computed / Enriched Fields
//   currentWorkout?: WorkoutTemplate;
//   currentWeek?: WeeklySchedule;
//   summary: {
//     total: number;
//     completed: number;
//   };
// }

// // ============================================
// // Mapper Function (no schema validation)
// // ============================================

// /**
//  * Convert FitnessPlan entity to API presentation format
//  * 
//  * NOTE: No runtime validation - relies on TypeScript compile-time checks only
//  */
// export function toFitnessPlanPresentation(plan: FitnessPlan): FitnessPlanPresentation {
//   const currentWorkout = Queries.getCurrentWorkout(plan);
//   const currentWeek = Queries.getCurrentWeek(plan);
//   const summary = Queries.getWorkoutSummary(plan);

//   return {
//     id: plan.id,
//     userId: plan.userId,
//     title: plan.title,
//     description: plan.description,
//     planType: plan.planType,
//     goals: {
//       ...plan.goals,
//       secondary: [...plan.goals.secondary],
//       targetMetrics: {
//         ...plan.goals.targetMetrics,
//         targetWeights: plan.goals.targetMetrics.targetWeights
//           ? [...plan.goals.targetMetrics.targetWeights]
//           : undefined,
//       },
//       targetDate: plan.goals.targetDate instanceof Date
//         ? plan.goals.targetDate.toISOString()
//         : plan.goals.targetDate,
//     },
//     progression: {
//       ...plan.progression,
//       deloadWeeks: plan.progression.deloadWeeks ? [...plan.progression.deloadWeeks] : undefined,
//       testWeeks: plan.progression.testWeeks ? [...plan.progression.testWeeks] : undefined,
//     },
//     constraints: {
//       ...plan.constraints,
//       availableDays: [...plan.constraints.availableDays],
//       availableEquipment: [...plan.constraints.availableEquipment],
//       injuries: plan.constraints.injuries ? plan.constraints.injuries.map(i => ({
//         ...i,
//         avoidExercises: [...i.avoidExercises]
//       })) : undefined,
//     },
//     weeks: plan.weeks.map(w => ({
//       ...w,
//       // Would need similar mapping for nested types
//       // This is a simplified example
//     })) as WeeklySchedule[],
//     status: plan.status,
//     currentPosition: plan.currentPosition,
//     startDate: plan.startDate.toISOString(),
//     endDate: plan.endDate?.toISOString(),
//     createdAt: plan.createdAt.toISOString(),
//     updatedAt: plan.updatedAt?.toISOString(),

//     // Computed
//     currentWorkout: currentWorkout ? currentWorkout : undefined, // Would need mapper
//     currentWeek: currentWeek ? currentWeek : undefined, // Would need mapper
//     summary,
//   };
// }

// // ============================================
// // Optional: Runtime validation helpers
// // ============================================

// /**
//  * If you want runtime validation without Zod, you'd need to write validators
//  * This is just an example of what that might look like
//  */
// export function validateFitnessPlanPresentation(data: unknown): data is FitnessPlanPresentation {
//   if (typeof data !== 'object' || data === null) return false;

//   const plan = data as Record<string, unknown>;

//   // Basic type checks
//   if (typeof plan.id !== 'string') return false;
//   if (typeof plan.userId !== 'string') return false;
//   if (typeof plan.title !== 'string') return false;

//   // Length validations (like Zod's .min().max())
//   if (plan.title.length < 1 || plan.title.length > 100) return false;
//   if (typeof plan.description !== 'string' || plan.description.length < 1 || plan.description.length > 1000) return false;

//   // Enum validations
//   const validPlanTypes: PlanType[] = ['event_training', 'habit_building', 'strength_program', 'general_fitness'];
//   if (!validPlanTypes.includes(plan.planType as PlanType)) return false;

//   const validStatuses: PlanStatus[] = ['draft', 'active', 'paused', 'completed', 'abandoned'];
//   if (!validStatuses.includes(plan.status as PlanStatus)) return false;

//   // ... more validations would be needed
//   // This gets verbose quickly!

//   return true;
// }

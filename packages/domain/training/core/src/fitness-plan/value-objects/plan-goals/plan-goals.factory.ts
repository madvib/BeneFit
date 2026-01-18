import { Result } from '@bene/shared';
import { GoalsValidationError } from '../../errors/fitness-plan-errors.js';
import { PlanGoals, TargetMetrics, TargetLiftWeight, PlanGoalsView } from './plan-goals.types.js';
import { PlanGoalsSchema } from './plan-goals.schema.js';

export interface PlanGoalsProps {
  readonly primary: string;
  readonly secondary: readonly string[];
  readonly targetMetrics: TargetMetrics;
  readonly targetDate?: Date;
}

export function createPlanGoals(props: PlanGoalsProps): Result<PlanGoals> {
  // Use Zod schema for validation
  const validationResult = PlanGoalsSchema.safeParse(props);

  if (!validationResult.success) {
    // Map Zod error to our domain error
    const zodError = validationResult.error;
    // console.log('PlanGoals validation error:', JSON.stringify(zodError, null, 2));

    // ZodError has .issues, .errors is sometimes an alias or missing depending on version/context
    const issues = zodError.issues || (zodError as any).errors;

    if (!issues || issues.length === 0) {
      return Result.fail(new GoalsValidationError('Unknown validation error', { original: zodError }));
    }

    const firstError = issues[0];
    if (!firstError) {
      return Result.fail(new GoalsValidationError('Unknown validation error (empty issues)', { original: zodError }));
    }

    return Result.fail(
      new GoalsValidationError(firstError.message, {
        path: firstError.path.join('.'),
        code: firstError.code,
      }),
    );
  }

  // Double check target date logic if it wasn't caught by schema (Zod handles types/structure)
  // Schema handles "future date" validation if we add refinements, but let's keep domain rule explicit for now
  if (props.targetDate && props.targetDate <= new Date()) {
    return Result.fail(
      new GoalsValidationError('Target date must be in the future', {
        targetDate: props.targetDate,
      }),
    );
  }

  return Result.ok(props);
}

// Factory methods for common goal types
export function createEventTraining(
  eventName: string,
  distance: number, // meters
  targetDate: Date,
  targetPace: number, // seconds per km or mile
): Result<PlanGoals> {
  return createPlanGoals({
    primary: `${ eventName } Training`,
    secondary: [
      `Run ${ distance / 1000 }km`,
      `Run at pace of ${ Math.floor(targetPace / 60) }:${ targetPace % 60 }/km`,
    ],
    targetMetrics: {
      targetDistance: distance,
      targetPace,
    },
    targetDate,
  });
}

export function createStrengthBuilding(
  primary: string,
  targetWeights: TargetLiftWeight[],
  targetDate?: Date,
): Result<PlanGoals> {
  return createPlanGoals({
    primary,
    secondary: targetWeights.map((w) => `Lift ${ w.weight }kg in ${ w.exercise }`),
    targetMetrics: {
      targetWeights,
    },
    targetDate,
  });
}

export function createHabitBuilding(
  habit: string,
  minStreakDays: number,
  targetDate?: Date,
): Result<PlanGoals> {
  return createPlanGoals({
    primary: `${ habit } Habit Building`,
    secondary: [`Maintain ${ habit } for at least ${ minStreakDays } days in a row`],
    targetMetrics: {
      minStreakDays,
    },
    targetDate,
  });
}

// Mapper: Entity -> View (handles Date serialization)
export function toPlanGoalsView(goals: PlanGoals): PlanGoalsView {
  return {
    ...goals,
    targetDate: goals.targetDate?.toISOString(),
  };
}

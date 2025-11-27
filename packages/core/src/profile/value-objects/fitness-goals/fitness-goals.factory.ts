import { Guard, Result } from '@shared';
import { PrimaryFitnessGoal, TargetWeight, FitnessGoals } from './fitness-goals.types.js';

export interface CreateFitnessGoalsProps {
  primary: PrimaryFitnessGoal;
  motivation: string;
  secondary?: string[];
  targetWeight?: TargetWeight;
  targetBodyFat?: number;
  targetDate?: Date;
  successCriteria?: string[];
}

export function createFitnessGoals(props: {
  primary: PrimaryFitnessGoal;
  motivation: string;
  secondary?: string[];
  targetWeight?: TargetWeight;
  targetBodyFat?: number;
  targetDate?: Date;
  successCriteria?: string[];
}): Result<FitnessGoals> {
  const guards = [
    Guard.againstNullOrUndefinedBulk([
      { argument: props.primary, argumentName: 'primary' },
      { argument: props.motivation, argumentName: 'motivation' },
    ]),
    Guard.againstEmptyString(props.motivation, 'motivation'),
    Guard.againstTooLong(props.motivation, 500, 'motivation'),
  ];

  if (props.targetWeight) {
    guards.push(
      Guard.againstNegativeOrZero(props.targetWeight.current, 'targetWeight.current')
    );
    guards.push(
      Guard.againstNegativeOrZero(props.targetWeight.target, 'targetWeight.target')
    );
  }

  if (props.targetBodyFat !== undefined) {
    guards.push(Guard.inRange(props.targetBodyFat, 3, 50, 'targetBodyFat'));
  }

  if (props.targetDate) {
    const guardResult = Guard.isTrue(props.targetDate > new Date(), 'targetDate must be in the future');
    if (guardResult.isFailure) {
      return Result.fail(guardResult.error);
    }
  }
  
  const guardResult = Guard.combine(guards);
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    primary: props.primary,
    secondary: props.secondary || [],
    targetWeight: props.targetWeight,
    targetBodyFat: props.targetBodyFat,
    targetDate: props.targetDate,
    motivation: props.motivation,
    successCriteria: props.successCriteria || [],
  });
}
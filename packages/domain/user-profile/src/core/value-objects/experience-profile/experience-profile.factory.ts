import { Guard, Result } from '@bene/domain-shared';
import { CurrentCapabilities, ExperienceLevel, ExperienceProfile, TrainingHistory } from './experience-profile.types.js';

export interface CreateExperienceProfileProps {
  level: ExperienceLevel;
  history?: Partial<TrainingHistory>;
  capabilities: CurrentCapabilities;
}

export function createExperienceProfile(props: {
  level: ExperienceLevel;
  history?: Partial<TrainingHistory>;
  capabilities: CurrentCapabilities;
}): Result<ExperienceProfile> {
  const guards = [
    Guard.againstNullOrUndefinedBulk([
      { argument: props.level, argumentName: 'level' },
      { argument: props.capabilities, argumentName: 'capabilities' },
    ]),
  ];

  if (props.history?.yearsTraining !== undefined) {
    guards.push(Guard.againstNegative(props.history.yearsTraining, 'yearsTraining'));
  }
  const guardResult = Guard.combine(guards);
  if (guardResult && guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    level: props.level,
    history: {
      yearsTraining: props.history?.yearsTraining,
      previousPrograms: props.history?.previousPrograms || [],
      sports: props.history?.sports || [],
      certifications: props.history?.certifications || [],
    },
    capabilities: props.capabilities,
    lastAssessmentDate: new Date(),
  });
}
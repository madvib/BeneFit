import {
  ExperienceProfile,
  UserExperienceLevel,
} from '@bene/training-core';
import {
  type ExperienceProfile as SharedExperienceProfile,
} from '@bene/shared';

export function toDomainExperienceProfile(
  experience: SharedExperienceProfile,
): ExperienceProfile {
  return {
    level: experience.level as UserExperienceLevel,
    history: {
      previousPrograms: experience.history.previousPrograms,
      sports: experience.history.sports,
      certifications: experience.history.certifications,
      yearsTraining: experience.history.yearsTraining,
    },
    capabilities: {
      canDoFullPushup: experience.capabilities.canDoFullPushup,
      canDoFullPullup: experience.capabilities.canDoFullPullup,
      canRunMile: experience.capabilities.canRunMile,
      canSquatBelowParallel: experience.capabilities.canSquatBelowParallel,
      estimatedMaxes: experience.capabilities.estimatedMaxes
        ? {
          squat: experience.capabilities.estimatedMaxes.squat,
          bench: experience.capabilities.estimatedMaxes.bench,
          deadlift: experience.capabilities.estimatedMaxes.deadlift,
          unit: experience.capabilities.estimatedMaxes.unit as 'kg' | 'lbs',
        }
        : undefined,
    },
    lastAssessmentDate: new Date(experience.lastAssessmentDate),
  };
}

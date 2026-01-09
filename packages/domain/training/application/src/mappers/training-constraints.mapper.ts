import {
  TrainingConstraints,
  InjurySeverity,
  PreferredTime,
  TrainingLocation,
} from '@bene/training-core';
import {
  type TrainingConstraints as SharedTrainingConstraints,
} from '@bene/shared';

export function toDomainTrainingConstraints(
  constraints: SharedTrainingConstraints,
): TrainingConstraints {
  return {
    injuries: constraints.injuries?.map((injury) => ({
      bodyPart: injury.bodyPart,
      severity: injury.severity as InjurySeverity,
      avoidExercises: injury.avoidExercises,
      notes: injury.notes,
      reportedDate: injury.reportedDate || new Date().toISOString(),
    })),
    availableDays: constraints.availableDays,
    preferredTime: constraints.preferredTime as PreferredTime,
    maxDuration: constraints.maxDuration,
    availableEquipment: constraints.availableEquipment,
    location: constraints.location as TrainingLocation,
  };
}

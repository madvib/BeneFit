import { serializeForView } from '@bene/shared';
import { TrainingConstraints, TrainingConstraintsView } from './training-constraints.types.js';

export function toTrainingConstraintsView(
  constraints: TrainingConstraints,
): TrainingConstraintsView {
  return serializeForView(constraints)

}

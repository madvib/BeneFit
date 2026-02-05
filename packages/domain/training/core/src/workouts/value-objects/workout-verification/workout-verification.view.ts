import { CreateView, serializeForView } from '@bene/shared';
import { WorkoutVerification, VerificationData } from './workout-verification.types.js';

export type WorkoutVerificationView = CreateView<WorkoutVerification>;
type VerificationDataView = CreateView<VerificationData>;

function toVerificationDataView(data: VerificationData): VerificationDataView {
  return serializeForView(data);
}

export function toWorkoutVerificationView(
  verification: WorkoutVerification,
): WorkoutVerificationView {
  return {
    ...verification,
    verifiedAt: verification.verifiedAt?.toISOString(),
    verifications: verification.verifications.map(toVerificationDataView),
  };
}

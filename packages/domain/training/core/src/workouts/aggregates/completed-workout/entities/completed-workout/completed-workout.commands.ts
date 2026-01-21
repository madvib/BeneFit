import { Guard, Result } from '@bene/shared';
import { VerificationData } from '../../../../value-objects/workout-verification/workout-verification.types.js';
import { createWorkoutVerification } from '../../../../value-objects/workout-verification/workout-verification.factory.js';
import { Reaction } from '../reaction/reaction.types.js';
import { CompletedWorkout } from './completed-workout.types.js';

export function addReaction(
  workout: CompletedWorkout,
  reaction: Reaction,
): Result<CompletedWorkout> {
  const guardResult = Guard.againstNullOrUndefined(reaction, 'reaction');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Check if user already reacted
  const existingReaction = workout.reactions.find((r) => r.userId === reaction.userId);

  if (existingReaction) {
    // Update existing reaction
    return Result.ok({
      ...workout,
      reactions: workout.reactions.map((r) =>
        r.userId === reaction.userId ? reaction : r,
      ),
    });
  }

  // Add new reaction
  return Result.ok({
    ...workout,
    reactions: [...workout.reactions, reaction],
  });
}

export function removeReaction(
  workout: CompletedWorkout,
  userId: string,
): Result<CompletedWorkout> {
  const guardResult = Guard.againstEmptyString(userId, 'userId');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...workout,
    reactions: workout.reactions.filter((r) => r.userId !== userId),
  });
}

export function makePublic(workout: CompletedWorkout): CompletedWorkout {
  return {
    ...workout,
    isPublic: true,
  };
}

export function makePrivate(workout: CompletedWorkout): CompletedWorkout {
  return {
    ...workout,
    isPublic: false,
  };
}

export function addVerification(
  workout: CompletedWorkout,
  newVerification: VerificationData,
): Result<CompletedWorkout> {
  const guardResult = Guard.againstNullOrUndefined(newVerification, 'verification');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Create updated verification with new verification added
  const updatedVerifications = [...workout.verification.verifications, newVerification];
  const verificationResult = createWorkoutVerification({
    verifications: updatedVerifications,
    verifiedAt: new Date(),
  });

  if (verificationResult.isFailure) return Result.fail(verificationResult.error);

  return Result.ok({
    ...workout,
    verification: verificationResult.value,
  });
}

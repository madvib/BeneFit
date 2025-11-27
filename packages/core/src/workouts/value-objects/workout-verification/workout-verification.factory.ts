import { Guard, Result } from '@shared';
import { VerificationData, WorkoutVerification } from './workout-verification.js';

export function createWorkoutVerification(props: {
  verifications: VerificationData[];
}): Result<WorkoutVerification> {
  const guards = [Guard.againstNullOrUndefined(props.verifications, 'verifications')];

  // Validate each verification
  for (const verification of props.verifications) {
    switch (verification.method) {
      case 'gps': {
        const gps = verification.data;
        guards.push(
          Guard.inRange(gps.latitude, -90, 90, 'latitude'),
          Guard.inRange(gps.longitude, -180, 180, 'longitude'),
          Guard.againstNegativeOrZero(gps.accuracy, 'accuracy'),
          Guard.againstNullOrUndefined(gps.timestamp, 'timestamp'),
        );
        break;
      }
      case 'gym_checkin': {
        const gym = verification.data;
        guards.push(
          Guard.againstEmptyString(gym.gymId, 'gymId'),
          Guard.againstEmptyString(gym.gymName, 'gymName'),
          Guard.againstNullOrUndefined(gym.checkinTime, 'checkinTime'),
        );
        if (gym.checkoutTime) {
          guards.push(
            Guard.isTrue(
              gym.checkoutTime >= gym.checkinTime,
              'checkoutTime must be after checkinTime',
            ),
          );
        }
        break;
      }
      case 'wearable': {
        const wearable = verification.data;
        guards.push(
          Guard.againstEmptyString(wearable.device, 'device'),
          Guard.againstEmptyString(wearable.activityId, 'activityId'),
          Guard.againstNullOrUndefined(wearable.syncedAt, 'syncedAt'),
        );
        break;
      }
      case 'photo': {
        const photo = verification.data;
        guards.push(
          Guard.againstEmptyString(photo.photoUrl, 'photoUrl'),
          Guard.againstNullOrUndefined(photo.uploadedAt, 'uploadedAt'),
        );
        break;
      }
      case 'witness': {
        const witness = verification.data;
        guards.push(
          Guard.againstEmptyString(witness.witnessUserId, 'witnessUserId'),
          Guard.againstEmptyString(witness.witnessName, 'witnessName'),
          Guard.againstNullOrUndefined(witness.verifiedAt, 'verifiedAt'),
        );
        break;
      }
    }
  }
  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  // Determine if verified and sponsor eligible
  const hasStrongVerification = props.verifications.some(
    (v) => v.method === 'gps' || v.method === 'gym_checkin' || v.method === 'wearable',
  );

  const verified =
    props.verifications.length > 0 && props.verifications[0].method !== 'manual';
  const sponsorEligible = hasStrongVerification;

  return Result.ok({
    verified,
    verifications: props.verifications,
    sponsorEligible,
    verifiedAt: verified ? new Date() : undefined,
  });
}

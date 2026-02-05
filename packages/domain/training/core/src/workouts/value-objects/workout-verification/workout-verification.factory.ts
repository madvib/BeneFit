import { z } from 'zod';
import { Guard, Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  WorkoutVerification,
  WorkoutVerificationSchema,
} from './workout-verification.types.js';

/**
 * ============================================================================
 * WORKOUT VERIFICATION FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. workoutVerificationFromPersistence() - For fixtures & DB hydration
 * 2. CreateWorkoutVerificationSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates GPS coordinates are in valid ranges */
function validateGPSData(data: unknown): Result<unknown> {
  if (!data || typeof data !== 'object') {
    return Result.fail(new Error('GPS data must be an object'));
  }

  const gps = data as { latitude?: unknown; longitude?: unknown; accuracy?: unknown };

  if (typeof gps.latitude !== 'number' || typeof gps.longitude !== 'number' || typeof gps.accuracy !== 'number') {
    return Result.fail(new Error('GPS data must have numeric latitude, longitude, and accuracy'));
  }

  const guards = [
    Guard.inRange(gps.latitude, -90, 90, 'latitude'),
    Guard.inRange(gps.longitude, -180, 180, 'longitude'),
    Guard.againstNegativeOrZero(gps.accuracy, 'accuracy'),
  ];
  return Guard.combine(guards);
}

/** Validates gym check-in/out times are logical */
function validateGymCheckinData(data: unknown): Result<unknown> {
  if (!data || typeof data !== 'object') {
    return Result.fail(new Error('Gym check-in data must be an object'));
  }

  const gym = data as { checkinTime?: unknown; checkoutTime?: unknown };

  if (!(gym.checkinTime instanceof Date)) {
    return Result.fail(new Error('checkinTime must be a Date'));
  }

  if (gym.checkoutTime) {
    if (!(gym.checkoutTime instanceof Date)) {
      return Result.fail(new Error('checkoutTime must be a Date'));
    }
    return Guard.isTrue(
      gym.checkoutTime >= gym.checkinTime,
      'checkoutTime must be after checkinTime',
    );
  }
  return Result.ok(undefined);
}

/** Determines if verification is strong enough for sponsor eligibility */
function hasStrongVerification(verificationMethods: string[]): boolean {
  return verificationMethods.some(
    (method) => method === 'gps' || method === 'gym_checkin' || method === 'wearable',
  );
}

/** Validates WorkoutVerification with domain-specific business rules */
function validateWorkoutVerification(data: unknown): Result<WorkoutVerification> {
  // Parse with Zod schema
  const parseResult = WorkoutVerificationSchema.safeParse(data);

  if (!parseResult.success) {
    console.error('Zod Parse Failure:', JSON.stringify(parseResult.error.format(), null, 2));
    return Result.fail(mapZodError(parseResult.error));
  }

  const validated = parseResult.data;

  // Domain validation for each verification method
  const guards = [Guard.againstNullOrUndefined(validated.verifications, 'verifications')];

  for (const verification of validated.verifications) {
    switch (verification.method) {
      case 'gps': {
        const gpsResult = validateGPSData(verification.data);
        if (gpsResult.isFailure) {
          console.error('GPS Validation Failure:', gpsResult.error);
          return Result.fail(gpsResult.error);
        }
        break;
      }
      case 'gym_checkin': {
        const gymResult = validateGymCheckinData(verification.data);
        if (gymResult.isFailure) {
          console.error('Gym Checkin Validation Failure:', gymResult.error);
          return Result.fail(gymResult.error);
        }
        break;
      }
    }
  }

  const guardResult = Guard.combine(guards);
  if (guardResult.isFailure) {
    console.error('Guard Failure:', guardResult.error);
    return Result.fail(guardResult.error);
  }

  return Result.ok(validated);
}


// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates WorkoutVerification from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function workoutVerificationFromPersistence(
  data: Unbrand<WorkoutVerification>,
): Result<WorkoutVerification> {
  return Result.ok(data as WorkoutVerification);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating WorkoutVerification with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Domain Invariants:
 * - GPS coordinates must be in valid ranges
 * - Gym checkout must be after checkin
 * - Verification status auto-determined from methods
 * - Sponsor eligibility based on verification strength
 * - VerifiedAt auto-set if verified
 * 
 * Infer input type with: z.input<typeof CreateWorkoutVerificationSchema>
 */
const CreateWorkoutVerificationBaseSchema = WorkoutVerificationSchema.pick({
  verifications: true,
}).extend({
  // Optional overrides for system/admin use
  verified: z.boolean().optional(),
  sponsorEligible: z.boolean().optional(),
  verifiedAt: z.coerce.date<Date>().optional(),
});

/**
 * Zod transform for creating WorkoutVerification with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Domain Invariants:
 * - GPS coordinates must be in valid ranges
 * - Gym checkout must be after checkin
 * - Verification status auto-determined from methods
 * - Sponsor eligibility based on verification strength
 * - VerifiedAt auto-set if verified
 * 
 * Infer input type with: z.input<typeof CreateWorkoutVerificationSchema>
 */
export const CreateWorkoutVerificationSchema: z.ZodType<
  WorkoutVerification

> = CreateWorkoutVerificationBaseSchema.transform((input, ctx) => {
  const data = buildVerificationData(input);
  const validationResult = validateWorkoutVerification(data);
  return unwrapOrIssue(validationResult, ctx);
});

/**
 * Internal logic for creating/transforming a workout verification.
 */
function buildVerificationData(input: any): Unbrand<WorkoutVerification> {
  // Determine verification status (auto-computed)
  const verified = input.verified ?? (
    input.verifications.length > 0 && input.verifications[0]?.method !== 'manual'
  );

  const sponsorEligible = input.sponsorEligible ?? hasStrongVerification(input.verifications.map((v: any) => v.method));

  return {
    verified,
    verifications: input.verifications,
    sponsorEligible,
    verifiedAt: input.verifiedAt ?? (verified ? new Date() : undefined),
  } as Unbrand<WorkoutVerification>;
}




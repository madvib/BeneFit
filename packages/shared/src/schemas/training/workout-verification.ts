import { z } from 'zod';

// Workout Verification Schemas

export const VerificationMethodSchema = z.enum([
  'gps',
  'gym_checkin',
  'wearable',
  'photo',
  'witness',
  'manual',
]);

export const GPSVerificationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number(), // meters
  timestamp: z.string(), // ISO date string
});

export const GymCheckinVerificationSchema = z.object({
  gymId: z.string(),
  gymName: z.string(),
  checkinTime: z.string(), // ISO date string
  checkoutTime: z.string().optional(), // ISO date string
});

export const WearableVerificationSchema = z.object({
  device: z.string(), // e.g., "Apple Watch Series 8"
  activityId: z.string(), // ID in wearable system
  source: z.enum(['apple_health', 'garmin', 'fitbit', 'strava', 'other']),
  syncedAt: z.string(), // ISO date string
});

export const PhotoVerificationSchema = z.object({
  photoUrl: z.string(),
  uploadedAt: z.string(), // ISO date string
  verified: z.boolean(), // Manually verified by admin/AI
});

export const WitnessVerificationSchema = z.object({
  witnessUserId: z.string(),
  witnessName: z.string(),
  verifiedAt: z.string(), // ISO date string
});

export const VerificationDataSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('gps'), data: GPSVerificationSchema }),
  z.object({ method: z.literal('gym_checkin'), data: GymCheckinVerificationSchema }),
  z.object({ method: z.literal('wearable'), data: WearableVerificationSchema }),
  z.object({ method: z.literal('photo'), data: PhotoVerificationSchema }),
  z.object({ method: z.literal('witness'), data: WitnessVerificationSchema }),
  z.object({ method: z.literal('manual'), data: z.null() }),
]);

export const WorkoutVerificationSchema = z.object({
  verified: z.boolean(),
  verifications: z.array(VerificationDataSchema),
  sponsorEligible: z.boolean(), // Can corporate sponsors count this?
  verifiedAt: z.string().optional(), // ISO date string
});

// Export inferred types
export type GPSVerification = z.infer<typeof GPSVerificationSchema>;
export type GymCheckinVerification = z.infer<typeof GymCheckinVerificationSchema>;
export type WearableVerification = z.infer<typeof WearableVerificationSchema>;
export type PhotoVerification = z.infer<typeof PhotoVerificationSchema>;
export type WitnessVerification = z.infer<typeof WitnessVerificationSchema>;
export type VerificationData = z.infer<typeof VerificationDataSchema>;
export type WorkoutVerification = z.infer<typeof WorkoutVerificationSchema>;


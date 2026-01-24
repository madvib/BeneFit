import { z } from 'zod';
import { VERIFICATION_METHODS, VERIFICATION_PLATFORMS } from '@bene/shared';

export const VerificationMethodSchema = z.enum(VERIFICATION_METHODS);

export const VerificationPlatformSchema = z.enum(VERIFICATION_PLATFORMS);

export const GPSVerificationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(10000), // meters
  timestamp: z.coerce.date<Date>(),
}).readonly();
export type GPSVerification = z.infer<typeof GPSVerificationSchema>;

export const GymCheckinVerificationSchema = z.object({
  gymId: z.uuid(),
  gymName: z.string().min(1).max(200),
  checkinTime: z.coerce.date<Date>(),
  checkoutTime: z.coerce.date<Date>().optional(),
}).readonly();
export type GymCheckinVerification = z.infer<typeof GymCheckinVerificationSchema>;

export const WearableVerificationSchema = z.object({
  device: z.string().min(1).max(100),
  activityId: z.string().min(1).max(100),
  source: VerificationPlatformSchema,
  syncedAt: z.coerce.date<Date>(),
}).readonly();
export type WearableVerification = z.infer<typeof WearableVerificationSchema>;

export const PhotoVerificationSchema = z.object({
  photoUrl: z.string().url(),
  uploadedAt: z.coerce.date<Date>(),
  verified: z.boolean(),
});
export type PhotoVerification = z.infer<typeof PhotoVerificationSchema>;

export const WitnessVerificationSchema = z.object({
  witnessUserId: z.uuid(),
  witnessName: z.string().min(1).max(100),
  verifiedAt: z.coerce.date<Date>(),
}).readonly();

export type WitnessVerification = z.infer<typeof WitnessVerificationSchema>;

export const VerificationDataSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('gps'), data: GPSVerificationSchema }),
  z.object({ method: z.literal('gym_checkin'), data: GymCheckinVerificationSchema }),
  z.object({ method: z.literal('wearable'), data: WearableVerificationSchema }),
  z.object({ method: z.literal('photo'), data: PhotoVerificationSchema }),
  z.object({ method: z.literal('witness'), data: WitnessVerificationSchema }),
  z.object({ method: z.literal('manual'), data: z.null() }),
]).readonly();
export type VerificationData = z.infer<typeof VerificationDataSchema>;

export const WorkoutVerificationSchema = z.object({
  verified: z.boolean(),
  verifications: z.array(VerificationDataSchema),
  sponsorEligible: z.boolean(),
  verifiedAt: z.coerce.date<Date>().optional(),
});

export type WorkoutVerification = Readonly<z.infer<typeof WorkoutVerificationSchema>>;

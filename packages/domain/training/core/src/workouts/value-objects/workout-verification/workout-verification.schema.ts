import { z } from 'zod';
import type {
  WorkoutVerification as DomainWorkoutVerification,
  VerificationData as DomainVerificationData,
} from './workout-verification.types.js';

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
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0).max(100), // meters
  timestamp: z.iso.datetime(),
});

export const GymCheckinVerificationSchema = z.object({
  gymId: z.string(),
  gymName: z.string().min(1).max(100),
  checkinTime: z.iso.datetime(),
  checkoutTime: z.iso.datetime().optional(),
});

export const WearableVerificationSchema = z.object({
  device: z.string().min(1).max(100), // e.g., "Apple Watch Series 8"
  activityId: z.string(), // ID in wearable system
  source: z.enum(['apple_health', 'garmin', 'fitbit', 'strava', 'other']),
  syncedAt: z.iso.datetime(),
});

export const PhotoVerificationSchema = z.object({
  photoUrl: z.string().url(),
  uploadedAt: z.iso.datetime(),
  verified: z.boolean(), // Manually verified by admin/AI
});

export const WitnessVerificationSchema = z.object({
  witnessUserId: z.string(),
  witnessName: z.string().min(1).max(100),
  verifiedAt: z.iso.datetime(),
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
  verifiedAt: z.iso.datetime().optional(),
});



// Converter functions: schema format (ISO strings) ↔ domain format (Date objects)

export function fromWorkoutVerificationSchema(
  schema: z.infer<typeof WorkoutVerificationSchema>
): DomainWorkoutVerification {
  return {
    verified: schema.verified,
    sponsorEligible: schema.sponsorEligible,
    verifiedAt: schema.verifiedAt ? new Date(schema.verifiedAt) : undefined,
    verifications: schema.verifications.map(v => {
      switch (v.method) {
        case 'gps':
          return {
            method: 'gps',
            data: {
              ...v.data,
              timestamp: new Date(v.data.timestamp)
            }
          } as DomainVerificationData;
        case 'gym_checkin':
          return {
            method: 'gym_checkin',
            data: {
              ...v.data,
              checkinTime: new Date(v.data.checkinTime),
              checkoutTime: v.data.checkoutTime ? new Date(v.data.checkoutTime) : undefined
            }
          } as DomainVerificationData;
        case 'wearable':
          return {
            method: 'wearable',
            data: {
              ...v.data,
              syncedAt: new Date(v.data.syncedAt)
            }
          } as DomainVerificationData;
        case 'photo':
          return {
            method: 'photo',
            data: {
              ...v.data,
              uploadedAt: new Date(v.data.uploadedAt)
            }
          } as DomainVerificationData;
        case 'witness':
          return {
            method: 'witness',
            data: {
              ...v.data,
              verifiedAt: new Date(v.data.verifiedAt)
            }
          } as DomainVerificationData;
        case 'manual':
          return { method: 'manual', data: null } as DomainVerificationData;
      }
    })
  } as DomainWorkoutVerification;
}

export function toWorkoutVerificationSchema(
  domain: DomainWorkoutVerification
): z.infer<typeof WorkoutVerificationSchema> {
  return {
    verified: domain.verified,
    sponsorEligible: domain.sponsorEligible,
    verifiedAt: domain.verifiedAt?.toISOString(),
    verifications: domain.verifications.map(v => {
      switch (v.method) {
        case 'gps':
          return {
            method: 'gps' as const,
            data: {
              ...v.data,
              timestamp: v.data.timestamp.toISOString()
            }
          };
        case 'gym_checkin':
          return {
            method: 'gym_checkin' as const,
            data: {
              ...v.data,
              checkinTime: v.data.checkinTime.toISOString(),
              checkoutTime: v.data.checkoutTime?.toISOString()
            }
          };
        case 'wearable':
          return {
            method: 'wearable' as const,
            data: {
              ...v.data,
              syncedAt: v.data.syncedAt.toISOString()
            }
          };
        case 'photo':
          return {
            method: 'photo' as const,
            data: {
              ...v.data,
              uploadedAt: v.data.uploadedAt.toISOString()
            }
          };
        case 'witness':
          return {
            method: 'witness' as const,
            data: {
              ...v.data,
              verifiedAt: v.data.verifiedAt.toISOString()
            }
          };
        case 'manual':
          return { method: 'manual' as const, data: null };
      }
    })
  };
}

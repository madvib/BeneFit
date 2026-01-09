import { z } from 'zod';

// Connected Service Schemas

export const ServiceTypeSchema = z.enum([
  'strava',
  'garmin',
  'apple_health',
  'fitbit',
  'whoop',
  'peloton',
  'polar',
  'coros',
  'google_fit',
]);

export const ServicePermissionsSchema = z.object({
  canReadActivities: z.boolean(),
  canWriteActivities: z.boolean(),
  canReadProfile: z.boolean(),
  canReadHeartRate: z.boolean(),
  scopes: z.array(z.string()),
});

export const SyncStatusSchema = z.object({
  lastSyncAt: z.string().optional(), // ISO date string
  lastSyncStatus: z.enum(['success', 'failed', 'in_progress']),
  lastError: z.string().optional(),
  totalActivitiesSynced: z.number(),
});

export const ServiceMetadataSchema = z.object({
  athleteId: z.string().optional(),
  athleteName: z.string().optional(),
  profileUrl: z.string().optional(),
  apiVersion: z.string().optional(),
});

export const ConnectedServiceSchema = z.object({
  id: z.string(),
  serviceType: ServiceTypeSchema,
  // Permissions granted
  permissions: ServicePermissionsSchema,
  // Sync status
  syncStatus: SyncStatusSchema,
  // Service metadata
  metadata: ServiceMetadataSchema,
  // State
  isActive: z.boolean(),
  isPaused: z.boolean(),
  // Timestamps
  connectedAt: z.string(), // ISO date string
  lastSyncAt: z.string().optional(), // ISO date string
});

// Export inferred types
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type ServicePermissions = z.infer<typeof ServicePermissionsSchema>;
export type SyncStatus = z.infer<typeof SyncStatusSchema>;
export type ServiceMetadata = z.infer<typeof ServiceMetadataSchema>;
export type ConnectedService = z.infer<typeof ConnectedServiceSchema>;

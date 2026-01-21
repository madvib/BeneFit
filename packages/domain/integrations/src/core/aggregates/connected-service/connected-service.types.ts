import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';
import {
  OAuthCredentialsSchema,
  ServiceMetadataSchema,
  ServicePermissionsSchema,
  SyncStatusSchema
} from '../../value-objects/index.js';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
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

export const ConnectedServiceSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    serviceType: ServiceTypeSchema,
    credentials: OAuthCredentialsSchema,
    permissions: ServicePermissionsSchema,
    syncStatus: SyncStatusSchema,
    metadata: ServiceMetadataSchema,
    isActive: z.boolean(),
    isPaused: z.boolean(),
    connectedAt: z.coerce.date<Date>(),
    lastSyncAt: z.coerce.date<Date>().optional(),
    updatedAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type ConnectedService = Readonly<z.infer<typeof ConnectedServiceSchema>>;


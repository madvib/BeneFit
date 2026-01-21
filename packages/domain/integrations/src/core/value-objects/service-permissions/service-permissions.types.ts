import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const ServicePermissionsSchema = z
  .object({
    readWorkouts: z.boolean().default(false),
    readHeartRate: z.boolean().default(false),
    readSleep: z.boolean().default(false),
    readNutrition: z.boolean().default(false),
    readBodyMetrics: z.boolean().default(false),
    writeWorkouts: z.boolean().default(false),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type ServicePermissions = Readonly<z.infer<typeof ServicePermissionsSchema>>;

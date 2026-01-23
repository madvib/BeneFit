import { z } from 'zod';

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
  });

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type ServicePermissions = Readonly<z.infer<typeof ServicePermissionsSchema>>;

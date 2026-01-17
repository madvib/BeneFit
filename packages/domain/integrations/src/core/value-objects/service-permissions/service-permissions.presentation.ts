import { z } from 'zod';
import { ServicePermissions } from './service-permission.js';

export const ServicePermissionsPresentationSchema = z.object({
  readWorkouts: z.boolean(),
  readHeartRate: z.boolean(),
  readSleep: z.boolean(),
  readNutrition: z.boolean(),
  readBodyMetrics: z.boolean(),
  writeWorkouts: z.boolean(),
});

export type ServicePermissionsPresentation = z.infer<typeof ServicePermissionsPresentationSchema>;

export function toServicePermissionsPresentation(
  permissions: ServicePermissions
): ServicePermissionsPresentation {
  return {
    readWorkouts: permissions.readWorkouts,
    readHeartRate: permissions.readHeartRate,
    readSleep: permissions.readSleep,
    readNutrition: permissions.readNutrition,
    readBodyMetrics: permissions.readBodyMetrics,
    writeWorkouts: permissions.writeWorkouts,
  };
}

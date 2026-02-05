import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { ServicePermissions, ServicePermissionsSchema } from './service-permissions.types.js';

/**
 * ============================================================================
 * SERVICE PERMISSIONS FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. servicePermissionsFromPersistence() - For fixtures & DB hydration
 * 2. CreateServicePermissionsSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates ServicePermissions with domain-specific business rules */
function validateServicePermissions(data: unknown): Result<ServicePermissions> {
  const parseResult = ServicePermissionsSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ServicePermissions from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function servicePermissionsFromPersistence(
  data: Unbrand<ServicePermissions>,
): Result<ServicePermissions> {
  return Result.ok(data as ServicePermissions);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating ServicePermissions with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateServicePermissionsSchema>
 */
export const CreateServicePermissionsSchema: z.ZodType<ServicePermissions> = ServicePermissionsSchema.partial().transform((input, ctx) => {
  const data = {
    ...input,
    readWorkouts: input.readWorkouts ?? false,
    readHeartRate: input.readHeartRate ?? false,
    readSleep: input.readSleep ?? false,
    readNutrition: input.readNutrition ?? false,
    readBodyMetrics: input.readBodyMetrics ?? false,
    writeWorkouts: input.writeWorkouts ?? false,
  };

  const validationResult = validateServicePermissions(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================



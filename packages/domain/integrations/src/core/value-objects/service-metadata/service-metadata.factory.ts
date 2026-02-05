import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { ServiceMetadata, ServiceMetadataSchema } from './service-metadata.types.js';
import z from 'zod';

/**
 * ============================================================================
 * SERVICE METADATA FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. serviceMetadataFromPersistence() - For fixtures & DB hydration
 * 2. CreateServiceMetadataSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates ServiceMetadata with domain-specific business rules */
function validateServiceMetadata(data: unknown): Result<ServiceMetadata> {
  const parseResult = ServiceMetadataSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ServiceMetadata from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function serviceMetadataFromPersistence(
  data: Unbrand<ServiceMetadata>,
): Result<ServiceMetadata> {
  return Result.ok(data as ServiceMetadata);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating ServiceMetadata with validation.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateServiceMetadataSchema>
 */
export const CreateServiceMetadataSchema: z.ZodType<ServiceMetadata> = ServiceMetadataSchema.partial().transform((input, ctx) => {
  const data = {
    ...input,
    supportsWebhooks: input.supportsWebhooks ?? false,
    webhookRegistered: input.webhookRegistered ?? false,
  };

  const validationResult = validateServiceMetadata(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================



import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import {
  createInitialSyncStatus,
  ServiceMetadataSchema,
  CreateServiceMetadataSchema
} from '../../value-objects/index.js';
import {
  ConnectedService,
  ConnectedServiceSchema,
} from './connected-service.types.js';

/**
 * ============================================================================
 * CONNECTED SERVICE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. connectedServiceFromPersistence() - For fixtures & DB hydration
 * 2. CreateConnectedServiceSchema - Zod transform for API boundaries
 * 
 * Everything else is internal.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands ConnectedService */
function validateConnectedService(data: unknown): Result<ConnectedService> {
  const parseResult = ConnectedServiceSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data as ConnectedService);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates ConnectedService from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function connectedServiceFromPersistence(
  data: Unbrand<ConnectedService>,
): Result<ConnectedService> {
  return Result.ok(data as ConnectedService);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating ConnectedService with validation.
 * Use at API boundaries (controllers, resolvers).
 */
export const CreateConnectedServiceSchema: z.ZodType<ConnectedService> = ConnectedServiceSchema.pick({
  userId: true,
  serviceType: true,
  credentials: true,
  permissions: true,
}).extend({
  id: z.uuid().optional(),
  metadata: ServiceMetadataSchema.partial().optional(),
  connectedAt: z.coerce.date<Date>().optional(),
  updatedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  const now = input.connectedAt || new Date();

  // Handle metadata transformation if provided, otherwise default via VO factory
  // Since we want to use the VO factory logic:
  const metadataResult = CreateServiceMetadataSchema.safeParse(input.metadata || {});
  if (!metadataResult.success) {
    return unwrapOrIssue(Result.fail(mapZodError(metadataResult.error)), ctx);
  }

  const data = {
    ...input,
    id: input.id || randomUUID(),
    syncStatus: createInitialSyncStatus(),
    metadata: metadataResult.data,
    isActive: true,
    isPaused: false,
    connectedAt: now,
    updatedAt: input.updatedAt || now,
  };

  const validationResult = validateConnectedService(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use CreateConnectedServiceSchema or connectedServiceFromPersistence.
 */
export function createConnectedService(
  params: z.input<typeof CreateConnectedServiceSchema>,
): Result<ConnectedService> {
  const parseResult = CreateConnectedServiceSchema.safeParse(params);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data);
}

import { z } from 'zod';

import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { PlanTemplate, PlanTemplateSchema } from './plan-template.types.js';

/**
 * ============================================================================
 * PLAN TEMPLATE FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (3 exports):
 * 1. planTemplateFromPersistence() - For fixtures & DB hydration
 * 2. CreatePlanTemplateSchema - Zod transform for API boundaries
 * 3. createTemplateRevision() - For creating new versions
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands data with PlanTemplateSchema */
function validateAndBrand(data: unknown): Result<PlanTemplate> {
  const parseResult = PlanTemplateSchema.safeParse(data);
  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }
  return Result.ok(parseResult.data);
}

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates PlanTemplate from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function planTemplateFromPersistence(
  data: Unbrand<PlanTemplate>,
): Result<PlanTemplate> {
  return Result.ok(data as PlanTemplate);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Zod transform for creating a new PlanTemplate.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreatePlanTemplateSchema>
 */
export const CreatePlanTemplateSchema: z.ZodType<PlanTemplate> = PlanTemplateSchema.pick({
  name: true,
  description: true,
  author: true,
  structure: true,
  rules: true,
}).extend({
  id: z.uuid().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.coerce.date<Date>().optional(),
  updatedAt: z.coerce.date<Date>().optional(),
}).transform((input, ctx) => {
  // Build the entity with defaults
  const now = new Date();
  const data = {
    ...input,
    id: input.id || crypto.randomUUID(),
    tags: input.tags ?? [],
    metadata: {
      isPublic: false,
      isFeatured: false,
      isVerified: false,
      usageCount: 0,
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
    },
    version: 1,
  };

  // Validate and brand
  const validationResult = validateAndBrand(data);
  return unwrapOrIssue(validationResult, ctx);
});

// ============================================================================
// 3. REVISION (for versioning)
// ============================================================================

/**
 * Creates a new revision (version) of an existing template.
 * Use this directly for revisions - simpler than Zod transform for this use case.
 */
export function createTemplateRevision(
  baseTemplate: PlanTemplate,
  updates: {
    name?: string;
    description?: string;
    author?: z.infer<typeof PlanTemplateSchema>['author'];
    tags?: string[];
  } = {},
): Result<PlanTemplate> {
  const now = new Date();

  const data = {
    ...baseTemplate,
    ...updates,
    metadata: {
      ...baseTemplate.metadata,
      isPublic: false,
      publishedAt: undefined,
      updatedAt: now,
      createdAt: now,
    },
    version: baseTemplate.version + 1,
  };

  return validateAndBrand(data);
}

import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';

/**
 * 1. DEFINE SCHEMAS (Zod as Source of Truth)
 */
export const ServiceUnitsSchema = z.enum(['metric', 'imperial']);

export const ServiceMetadataSchema = z
  .object({
    externalUserId: z.string().optional(),
    externalUsername: z.string().optional(),
    profileUrl: z.url().optional().or(z.literal('')), // specific URL validation
    athleteType: z.string().optional(),
    units: ServiceUnitsSchema.optional(),
    supportsWebhooks: z.boolean().default(false),
    webhookRegistered: z.boolean().default(false),
    webhookUrl: z.url().optional().or(z.literal('')),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES (Derived directly from Zod)
 */
export type ServiceUnits = z.infer<typeof ServiceUnitsSchema>;
export type ServiceMetadata = Readonly<z.infer<typeof ServiceMetadataSchema>>;

import { z } from 'zod';
import { ServiceMetadata } from './service-metadata.js';

export const UnitsSchema = z.enum(['metric', 'imperial']);

export const ServiceMetadataPresentationSchema = z.object({
  externalUserId: z.string().min(1).max(100).optional(),
  externalUsername: z.string().min(1).max(100).optional(),
  profileUrl: z.string().url().optional(),
  athleteType: z.string().min(1).max(50).optional(),
  units: UnitsSchema.optional(),
  supportsWebhooks: z.boolean(),
  webhookRegistered: z.boolean(),
  webhookUrl: z.string().url().optional(),
});

export type ServiceMetadataPresentation = z.infer<typeof ServiceMetadataPresentationSchema>;

export function toServiceMetadataPresentation(
  metadata: ServiceMetadata
): ServiceMetadataPresentation {
  return {
    externalUserId: metadata.externalUserId,
    externalUsername: metadata.externalUsername,
    profileUrl: metadata.profileUrl,
    athleteType: metadata.athleteType,
    units: metadata.units,
    supportsWebhooks: metadata.supportsWebhooks,
    webhookRegistered: metadata.webhookRegistered,
    webhookUrl: metadata.webhookUrl,
  };
}

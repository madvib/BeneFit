import { CreateView } from '@bene/shared';
import { ServiceMetadata } from './service-metadata.types.js';

/**
 * 3. VIEW TYPES
 */
export type ServiceMetadataView = CreateView<
  ServiceMetadata,
  'webhookUrl' | 'webhookRegistered'
>;

/**
 * Map ServiceMetadata to view model
 * Strips domain brand and internal webhook config
 */
export function toServiceMetadataView(metadata: ServiceMetadata): ServiceMetadataView {
  return {
    ...metadata,
  };
}

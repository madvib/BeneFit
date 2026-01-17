import { describe, it, expect } from 'vitest';
import {
  ServiceMetadataPresentationSchema,
  toServiceMetadataPresentation,
} from '../service-metadata.presentation.js';
import { createServiceMetadataFixture } from './service-metadata.fixtures.js';

describe('ServiceMetadata Presentation', () => {
  it('should map valid metadata to presentation DTO', () => {
    const metadata = createServiceMetadataFixture();
    const presentation = toServiceMetadataPresentation(metadata);

    const result = ServiceMetadataPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    expect(presentation).toEqual(metadata);
  });

  it('should handle webhook configuration', () => {
    const metadata = createServiceMetadataFixture({
      supportsWebhooks: true,
      webhookRegistered: true,
      webhookUrl: 'https://example.com/webhook',
    });
    const presentation = toServiceMetadataPresentation(metadata);

    expect(presentation.supportsWebhooks).toBe(true);
    expect(presentation.webhookRegistered).toBe(true);
    expect(presentation.webhookUrl).toBe('https://example.com/webhook');
  });

  it('should handle services without webhook support', () => {
    const metadata = createServiceMetadataFixture({
      supportsWebhooks: false,
      webhookRegistered: false,
      webhookUrl: undefined,
    });
    const presentation = toServiceMetadataPresentation(metadata);

    expect(presentation.supportsWebhooks).toBe(false);
    expect(presentation.webhookRegistered).toBe(false);
    expect(presentation.webhookUrl).toBeUndefined();
  });
});

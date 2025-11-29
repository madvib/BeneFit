import { describe, it, expect } from 'vitest';
import { createServiceMetadata } from './service-metadata.js';

describe('ServiceMetadata Value Object', () => {
  it('should create metadata with default values', () => {
    const metadata = createServiceMetadata({});

    expect(metadata.supportsWebhooks).toBe(false);
    expect(metadata.webhookRegistered).toBe(false);
  });

  it('should create metadata with provided values', () => {
    const metadata = createServiceMetadata({
      externalUserId: 'user-123',
      supportsWebhooks: true,
      webhookRegistered: true
    });

    expect(metadata.externalUserId).toBe('user-123');
    expect(metadata.supportsWebhooks).toBe(true);
    expect(metadata.webhookRegistered).toBe(true);
  });
});
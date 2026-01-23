import { describe, it, expect } from 'vitest';
import { randomUUID } from 'node:crypto';

import { createServiceMetadataFixture } from './service-metadata.fixtures.js';
import { CreateServiceMetadataSchema } from '../service-metadata.factory.js';

describe('ServiceMetadata', () => {
  describe('Factory', () => {
    it('should create metadata with default values', () => {
      // Act
      const result = CreateServiceMetadataSchema.safeParse({});

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.supportsWebhooks).toBe(false);
        expect(result.data.webhookRegistered).toBe(false);
      }
    });

    it('should create metadata with provided values', () => {
      // Arrange
      const externalUserId = randomUUID();
      const input = {
        externalUserId,
        supportsWebhooks: true,
        webhookRegistered: true
      };

      // Act
      const result = CreateServiceMetadataSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.externalUserId).toBe(externalUserId);
        expect(result.data.supportsWebhooks).toBe(true);
        expect(result.data.webhookRegistered).toBe(true);
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createServiceMetadataFixture();

      expect(fixture.externalUserId).toBeDefined();
      expect(fixture.units).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const externalUserId = randomUUID();
      const fixture = createServiceMetadataFixture({ externalUserId });

      expect(fixture.externalUserId).toBe(externalUserId);
    });
  });
});
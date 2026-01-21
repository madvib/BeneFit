import { describe, it, expect } from 'vitest';
import { CreateServiceMetadataSchema } from '../service-metadata.factory.js';
import { createServiceMetadataFixture } from './service-metadata.fixtures.js';

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
      const input = {
        externalUserId: '550e8400-e29b-41d4-a716-446655440000',
        supportsWebhooks: true,
        webhookRegistered: true
      };

      // Act
      const result = CreateServiceMetadataSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.externalUserId).toBe(input.externalUserId);
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
      const fixture = createServiceMetadataFixture({ externalUserId: 'custom-id' });

      expect(fixture.externalUserId).toBe('custom-id');
    });
  });
});
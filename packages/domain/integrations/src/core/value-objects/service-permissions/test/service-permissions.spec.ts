import { describe, it, expect } from 'vitest';
import { CreateServicePermissionsSchema } from '../service-permissions.factory.js';
import { createServicePermissionsFixture } from './service-permissions.fixtures.js';

describe('ServicePermissions', () => {
  describe('Factory', () => {
    it('should create permissions with default values', () => {
      // Act
      const result = CreateServicePermissionsSchema.safeParse({});

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.readWorkouts).toBe(false);
        expect(result.data.readHeartRate).toBe(false);
        expect(result.data.writeWorkouts).toBe(false);
      }
    });

    it('should create permissions with provided values', () => {
      // Arrange
      const input = {
        readWorkouts: true,
        readHeartRate: true
      };

      // Act
      const result = CreateServicePermissionsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.readWorkouts).toBe(true);
        expect(result.data.readHeartRate).toBe(true);
        expect(result.data.writeWorkouts).toBe(false); // default
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createServicePermissionsFixture();

      expect(fixture.readWorkouts).toBeDefined();
      expect(fixture.writeWorkouts).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createServicePermissionsFixture({ readWorkouts: true, writeWorkouts: true });

      expect(fixture.readWorkouts).toBe(true);
      expect(fixture.writeWorkouts).toBe(true);
    });
  });
});
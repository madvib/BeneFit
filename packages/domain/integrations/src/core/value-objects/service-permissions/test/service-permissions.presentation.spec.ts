import { describe, it, expect } from 'vitest';
import {
  ServicePermissionsPresentationSchema,
  toServicePermissionsPresentation,
} from '../service-permissions.presentation.js';
import { createServicePermissionsFixture } from './service-permissions.fixtures.js';

describe('ServicePermissions Presentation', () => {
  it('should map valid permissions to presentation DTO', () => {
    const permissions = createServicePermissionsFixture();
    const presentation = toServicePermissionsPresentation(permissions);

    const result = ServicePermissionsPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    expect(presentation).toEqual(permissions);
  });

  it('should handle all permissions enabled', () => {
    const permissions = createServicePermissionsFixture({
      readWorkouts: true,
      readHeartRate: true,
      readSleep: true,
      readNutrition: true,
      readBodyMetrics: true,
      writeWorkouts: true,
    });
    const presentation = toServicePermissionsPresentation(permissions);

    expect(presentation.readWorkouts).toBe(true);
    expect(presentation.readHeartRate).toBe(true);
    expect(presentation.readSleep).toBe(true);
    expect(presentation.readNutrition).toBe(true);
    expect(presentation.readBodyMetrics).toBe(true);
    expect(presentation.writeWorkouts).toBe(true);
  });

  it('should handle all permissions disabled', () => {
    const permissions = createServicePermissionsFixture({
      readWorkouts: false,
      readHeartRate: false,
      readSleep: false,
      readNutrition: false,
      readBodyMetrics: false,
      writeWorkouts: false,
    });
    const presentation = toServicePermissionsPresentation(permissions);

    expect(presentation.readWorkouts).toBe(false);
    expect(presentation.readHeartRate).toBe(false);
    expect(presentation.readSleep).toBe(false);
    expect(presentation.readNutrition).toBe(false);
    expect(presentation.readBodyMetrics).toBe(false);
    expect(presentation.writeWorkouts).toBe(false);
  });
});

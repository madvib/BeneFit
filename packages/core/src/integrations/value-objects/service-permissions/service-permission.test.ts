import { describe, it, expect } from 'vitest';
import { createServicePermissions } from './service-permission.js';

describe('ServicePermissions Value Object', () => {
  it('should create permissions with default values', () => {
    const permissions = createServicePermissions({});

    expect(permissions.readWorkouts).toBe(false);
    expect(permissions.readHeartRate).toBe(false);
    expect(permissions.writeWorkouts).toBe(false);
  });

  it('should create permissions with provided values', () => {
    const permissions = createServicePermissions({
      readWorkouts: true,
      readHeartRate: true
    });

    expect(permissions.readWorkouts).toBe(true);
    expect(permissions.readHeartRate).toBe(true);
    expect(permissions.writeWorkouts).toBe(false); // default
  });
});
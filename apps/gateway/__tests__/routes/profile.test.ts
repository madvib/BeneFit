import { describe, it, expect } from 'vitest';
import {
  createUserProfileRequest,
  updateFitnessGoalsRequest,
  updatePreferencesRequest,
  updateTrainingConstraintsRequest,
} from '../../__fixtures__/routes/profile.fixtures';
import {
  CreateUserProfileClientSchema,
  UpdateFitnessGoalsClientSchema,
  UpdatePreferencesClientSchema,
  UpdateTrainingConstraintsClientSchema,
} from '../../src/routes/profile.js';

describe('Profile Route Fixtures', () => {
  describe('Schema Validation', () => {
    it('createUserProfileRequest should match client schema', () => {
      expect(() => CreateUserProfileClientSchema.parse(createUserProfileRequest)).not.toThrow();
    });

    it('updateFitnessGoalsRequest should match client schema', () => {
      expect(() => UpdateFitnessGoalsClientSchema.parse(updateFitnessGoalsRequest)).not.toThrow();
    });

    it('updatePreferencesRequest should match client schema', () => {
      expect(() => UpdatePreferencesClientSchema.parse(updatePreferencesRequest)).not.toThrow();
    });

    it('updateTrainingConstraintsRequest should match client schema', () => {
      expect(() => UpdateTrainingConstraintsClientSchema.parse(updateTrainingConstraintsRequest)).not.toThrow();
    });
  });

  describe('Data Quality', () => {
    it('updateFitnessGoalsRequest should have goals', () => {
      expect(updateFitnessGoalsRequest.goals).toBeTruthy();
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  generatePlanFromGoalsRequest,
  activatePlanRequest,
  adjustPlanRequest,
  pausePlanRequest,
} from '../../__fixtures__/routes/fitness-plan.fixtures';
import {
  GeneratePlanFromGoalsClientSchema,
  ActivatePlanClientSchema,
  AdjustPlanClientSchema,
  PausePlanClientSchema,
} from '../../src/routes/fitness-plan.js';

describe('Fitness Plan Route Fixtures', () => {
  describe('Schema Validation', () => {
    it('generatePlanFromGoalsRequest should match client schema', () => {
      expect(() => GeneratePlanFromGoalsClientSchema.parse(generatePlanFromGoalsRequest)).not.toThrow();
    });

    it('activatePlanRequest should match client schema', () => {
      expect(() => ActivatePlanClientSchema.parse(activatePlanRequest)).not.toThrow();
    });

    it('adjustPlanRequest should match client schema', () => {
      expect(() => AdjustPlanClientSchema.parse(adjustPlanRequest)).not.toThrow();
    });

    it('pausePlanRequest should match client schema', () => {
      expect(() => PausePlanClientSchema.parse(pausePlanRequest)).not.toThrow();
    });
  });

  describe('Data Quality', () => {
    it('generatePlanFromGoalsRequest should have non-empty goals', () => {
      expect(generatePlanFromGoalsRequest.goals).toBeTruthy();
    });

    it('adjustPlanRequest should have non-empty feedback', () => {
      expect(adjustPlanRequest.feedback).toBeTruthy();
      expect(adjustPlanRequest.feedback.length).toBeGreaterThan(0);
    });
  });
});

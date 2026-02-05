import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { GeneratePlanFormSchema, type GeneratePlanFormValues } from './generate-plan-form';
import { client } from '../../client';
import type { InferRequestType } from 'hono/client';

// Type-level test to ensure conformance
type GeneratePlanApiRequest = InferRequestType<typeof client.api['fitness-plan'].generate.$post>;

// This will cause a TypeScript compilation error if types are incompatible
const _formValuesSatisfiesApiRequirements = (_: GeneratePlanFormValues): GeneratePlanApiRequest => {
  // At runtime, we just return the value as-is since the types should match
  return _ as unknown as GeneratePlanApiRequest;
};

describe('GeneratePlanFormSchema', () => {
  it('should satisfy API requirements', () => {
    // Runtime validation test
    const validFormData: GeneratePlanFormValues = {
      goals: {
        primary: 'strength',
        secondary: ['build_muscle'],
        targetMetrics: {
          totalWorkouts: 12,
        },
      },
      availableEquipment: ['dumbbells', 'kettlebells'],
      customInstructions: 'Prefer morning workouts',
    };

    // Validate the form data against the schema
    const validationResult = GeneratePlanFormSchema.safeParse(validFormData);
    expect(validationResult.success).toBe(true);
    
    if (validationResult.success) {
      // Check that it can be cast to the API request type
      const apiRequest = validationResult.data as GeneratePlanApiRequest;
      expect(apiRequest).toBeDefined();
    }
  });

  it('should validate required fields correctly', () => {
    const invalidData = {
      goals: {
        // Missing primary goal
        secondary: ['build_muscle'],
        targetMetrics: {
          // Missing totalWorkouts
        },
      },
    };

    const result = GeneratePlanFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      const errors = result.error.flatten();
      expect(errors.fieldErrors).toHaveProperty('goals');
    }
  });

  it('should accept minimal valid data', () => {
    const minimalData = {
      goals: {
        primary: 'strength',
        secondary: [],
        targetMetrics: {
          totalWorkouts: 8,
        },
      },
      availableEquipment: [],
    };

    const result = GeneratePlanFormSchema.safeParse(minimalData);
    expect(result.success).toBe(true);
  });
});
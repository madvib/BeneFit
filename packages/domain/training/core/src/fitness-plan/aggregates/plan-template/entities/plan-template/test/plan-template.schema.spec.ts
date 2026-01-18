import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { PlanTemplateSchema, toPlanTemplateSchema } from '../plan-template.presentation.js';
import { createPlanTemplateFixture } from './plan-template.fixtures.js';

describe('PlanTemplate Presentation', () => {
  it('should map a valid plan template entity to presentation DTO', () => {
    const template = createPlanTemplateFixture();
    const presentation = toPlanTemplateSchema(template);

    const result = PlanTemplateSchema.safeParse(presentation);

    if (!result.success) {
      console.log(JSON.stringify(z.treeifyError(result.error), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.id).toBe(template.id);
    expect(presentation.name).toBe(template.name);
    expect(presentation.metadata.createdAt).toBeTypeOf('string');
    expect(presentation.structure.duration.type).toBe(template.structure.duration.type);

    // Computed Fields
    expect(presentation.estimatedDuration).toHaveProperty('minWeeks');
    expect(presentation.estimatedDuration).toHaveProperty('maxWeeks');
    expect(presentation.frequency).toHaveProperty('minWorkouts');
    expect(presentation.frequency).toHaveProperty('maxWorkouts');
  });

  it('should handle optional fields correctly', () => {
    const template = createPlanTemplateFixture({
      previewWorkouts: undefined
    });
    const presentation = toPlanTemplateSchema(template);

    expect(presentation.previewWorkouts).toBeUndefined();
  });
});

import { describe, it, expect } from 'vitest';
import { FitnessGoalsSchema, toFitnessGoalsSchema } from '../fitness-goals.presentation.js';
import { createFitnessGoals } from '../fitness-goals.factory.js';

describe('FitnessGoals Presentation', () => {
  it('should map valid goals to presentation DTO', () => {
    const goals = createFitnessGoals({
      primary: 'strength',
      motivation: 'Be strong'
    }).value;

    const presentation = toFitnessGoalsSchema(goals);
    const result = FitnessGoalsSchema.safeParse(presentation);

    expect(result.success).toBe(true);
    expect(presentation.primary).toBe('strength');
    expect(presentation.motivation).toBe('Be strong');
  });
});

import { describe, it, expect } from 'vitest';
import { TemplateStructureSchema, toTemplateStructureSchema } from '../template-structure.presentation.js';
import { createTemplateStructureFixture } from './template-structure.fixtures.js';

describe('TemplateStructure Presentation', () => {
  it('should map valid template structure to presentation DTO', () => {
    const structure = createTemplateStructureFixture({
      duration: { type: 'fixed', weeks: 12 },
      frequency: { type: 'fixed', workoutsPerWeek: 4 },
      weeks: [{
        weekNumber: '*',
        workouts: [{
          type: 'strength',
          durationMinutes: 60,
          activities: [{
            activityType: 'main',
            template: 'Run',
            variables: {}
          }]
        }]
      }]
    });

    const presentation = toTemplateStructureSchema(structure);
    const result = TemplateStructureSchema.safeParse(presentation);

    if (!result.success) {
      console.log('Validation Error:', JSON.stringify(result.error.format(), null, 2));
    }
    expect(result.success).toBe(true);
    expect(presentation.duration.type).toBe('fixed');

    // Narrowing for test
    if (presentation.duration.type === 'fixed') {
      expect(presentation.duration.weeks).toBe(12);
    }
  });

  it('should handle optional fields and nested objects', () => {
    const structure = createTemplateStructureFixture({
      duration: { type: 'variable', min: 4, max: 8 },
      frequency: { type: 'flexible', min: 2, max: 5 },
      weeks: [{
        weekNumber: 1,
        workouts: [{
          type: 'rest',
          durationMinutes: 60,
          activities: [{ activityType: 'warmup', template: 'Stretch', variables: {} }]
        }]
      }],
      progressionFormula: '{{load}} * 1.05'
    });

    const presentation = toTemplateStructureSchema(structure);

    const result = TemplateStructureSchema.safeParse(presentation);
    if (!result.success) {
      console.log('Validation Error:', JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.frequency.type).toBe('flexible');
    expect(presentation.progressionFormula).toBeDefined();
    expect(presentation.deloadWeeks).toBeUndefined();
  });
});

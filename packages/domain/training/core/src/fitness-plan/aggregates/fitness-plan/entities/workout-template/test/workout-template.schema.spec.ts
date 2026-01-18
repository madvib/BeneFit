import { describe, it, expect } from 'vitest';
import { WorkoutTemplateSchema, toWorkoutTemplateSchema } from '../workout-template.presentation.js';
import { createWorkoutTemplateFixture } from './workout-template.fixtures.js';

describe('WorkoutTemplate Presentation', () => {
  it('should map a valid workout template entity to presentation DTO', () => {
    const template = createWorkoutTemplateFixture();
    const presentation = toWorkoutTemplateSchema(template);

    const result = WorkoutTemplateSchema.safeParse(presentation);

    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.id).toBe(template.id);
    expect(presentation.title).toBe(template.title);
    expect(presentation.activities.length).toBe(template.activities.length);
    if (presentation.activities.length > 0 && template.activities[0]) {
      expect(presentation.activities[0].name).toBe(template.activities[0].name);
    }
  });

  it('should handle optional fields correctly', () => {
    const template = createWorkoutTemplateFixture({
      description: undefined,
      userNotes: undefined,
      alternatives: undefined
    });
    const presentation = toWorkoutTemplateSchema(template);

    expect(presentation.description).toBeUndefined();
    expect(presentation.userNotes).toBeUndefined();
    expect(presentation.alternatives).toBeUndefined();
  });
});

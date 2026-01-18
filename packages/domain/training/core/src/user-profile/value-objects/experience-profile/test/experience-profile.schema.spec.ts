import { describe, it, expect } from 'vitest';
import { ExperienceProfileSchema, toExperienceProfileSchema } from '../experience-profile.schema.js';
import { createExperienceProfile } from '../experience-profile.factory.js';

describe('ExperienceProfile Presentation', () => {
  it('should map valid profile to presentation DTO', () => {
    // Let's use a valid one known to factory
    const validProfile = createExperienceProfile({
      level: 'advanced',
      capabilities: {
        canDoFullPushup: true,
        canDoFullPullup: true,
        canRunMile: true,
        canSquatBelowParallel: true
      }
    }).value;

    const presentation = toExperienceProfileSchema(validProfile);
    const result = ExperienceProfileSchema.safeParse(presentation);

    if (!result.success) {
      console.log('Validation Error:', JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    expect(presentation.level).toBe('advanced');
    expect(presentation.capabilities.canDoFullPushup).toBe(true);
  });
});

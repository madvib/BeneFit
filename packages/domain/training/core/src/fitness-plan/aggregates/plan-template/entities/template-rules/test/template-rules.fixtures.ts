import { faker } from '@faker-js/faker';
import { TemplateRules, ExperienceLevel, LocationType } from '../template-rules.types.js';

export function createTemplateRulesFixture(overrides?: Partial<TemplateRules>): TemplateRules {
  return {
    minExperienceLevel: faker.helpers.arrayElement(['beginner', 'intermediate'] as ExperienceLevel[]),
    maxExperienceLevel: faker.helpers.arrayElement(['intermediate', 'advanced'] as ExperienceLevel[]),
    requiredDaysPerWeek: faker.number.int({ min: 1, max: 7 }),
    requiredEquipment: faker.helpers.arrayElements(['Dumbbells', 'Barbell', 'Kettlebell'], { min: 0, max: 3 }),
    restrictions: {
      minSessionMinutes: 30,
      maxSessionMinutes: 90,
      requiresLocation: faker.helpers.arrayElements(['gym', 'home', 'outdoor'] as LocationType[], { min: 0, max: 2 }),
    },
    customizableParameters: [],
    ...overrides,
  };
}

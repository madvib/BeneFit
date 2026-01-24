import { faker } from '@faker-js/faker';
import { ExperienceLevel } from '@/shared/index.js';
import { TemplateRules, LocationType } from '../template-rules.types.js';
import { templateRulesFromPersistence } from '../template-rules.factory.js';

export function createTemplateRulesFixture(overrides?: Partial<TemplateRules>): TemplateRules {
  const data = {
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

  const result = templateRulesFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create TemplateRules fixture: ${ result.error }`);
  }

  return result.value;
}

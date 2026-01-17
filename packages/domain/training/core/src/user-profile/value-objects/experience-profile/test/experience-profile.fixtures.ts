import { faker } from '@faker-js/faker';
import { ExperienceProfile, ExperienceLevel } from '../experience-profile.types.js';

export function createExperienceProfileFixture(overrides?: Partial<ExperienceProfile>): ExperienceProfile {
  return {
    level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced'] as ExperienceLevel[]),
    history: {
      yearsTraining: faker.number.int({ min: 0, max: 20 }),
      previousPrograms: faker.helpers.arrayElements(['Starting Strength', 'PPL', 'CrossFit'], { min: 0, max: 2 }),
      sports: faker.helpers.arrayElements(['Soccer', 'Basketball', 'Tennis'], { min: 0, max: 2 }),
      certifications: [],
    },
    capabilities: {
      canDoFullPushup: faker.datatype.boolean(),
      canDoFullPullup: faker.datatype.boolean(),
      canRunMile: faker.datatype.boolean(),
      canSquatBelowParallel: faker.datatype.boolean(),
      estimatedMaxes: {
        squat: faker.number.int({ min: 40, max: 150 }),
        bench: faker.number.int({ min: 30, max: 100 }),
        deadlift: faker.number.int({ min: 60, max: 200 }),
        unit: 'kg',
      },
    },
    lastAssessmentDate: faker.date.past(),
    ...overrides,
  };
}

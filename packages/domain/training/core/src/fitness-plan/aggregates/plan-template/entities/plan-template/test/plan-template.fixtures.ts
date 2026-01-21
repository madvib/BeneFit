import { faker } from '@faker-js/faker';
import { createTemplateStructureFixture, createTemplateRulesFixture } from '@/fixtures.js';
import { PlanTemplate } from '../plan-template.types.js';
import { planTemplateFromPersistence } from '../plan-template.factory.js';

export function createPlanTemplateFixture(overrides: Partial<PlanTemplate> = {}): PlanTemplate {
  const structure = overrides.structure ?? createTemplateStructureFixture();
  const rules = overrides.rules ?? createTemplateRulesFixture();

  const data = {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    author: {
      name: faker.person.fullName(),
      userId: faker.string.uuid(),
      credentials: 'CPT'
    },
    tags: ['strength', 'general'],
    structure,
    rules,
    metadata: {
      isPublic: true,
      isFeatured: false,
      isVerified: true,
      rating: 4.5,
      usageCount: 100,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      publishedAt: faker.date.past()
    },
    previewWorkouts: [],
    version: 1,
    ...overrides
  };

  const result = planTemplateFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create PlanTemplate fixture: ${ result.error }`);
  }

  return result.value;
}

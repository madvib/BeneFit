import { faker } from '@faker-js/faker';
import { createTemplateRulesFixture } from '../../template-rules/index.js';
import { createTemplateStructureFixture } from '../../template-structure/index.js';
import { PlanTemplate } from '../plan-template.types.js';

export function createPlanTemplateFixture(overrides: Partial<PlanTemplate> = {}): PlanTemplate {
  const structure = createTemplateStructureFixture();
  const rules = createTemplateRulesFixture();

  return {
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
}

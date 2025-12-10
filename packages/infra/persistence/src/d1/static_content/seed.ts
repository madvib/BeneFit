import { D1Helper } from '@nerdfolio/drizzle-d1-helpers';
import { planTemplates, NewPlanTemplate } from './schema/plan_templates.js';
import { templateRatings, NewTemplateRating } from './schema/template_ratings.js';
import { templateTags, NewTemplateTag } from './schema/template_tags.js';
import { drizzle } from 'drizzle-orm/d1';

const now = Math.floor(Date.now() / 1000);

// Use your schema types for type safety
const plans: NewPlanTemplate[] = [
  {
    id: 'plan_001',
    name: 'Couch to 5k',
    description:
      'Beginner-friendly running plan to get you from couch to completing a 5k',
    authorUserId: 'user_001',
    authorName: 'Mike Tyson',
    minExperienceLevel: 'beginner',
    maxExperienceLevel: 'advanced',
    durationType: 'fixed',
    durationWeeksMin: 9,
    durationWeeksMax: 9,
    frequencyType: 'fixed',
    workoutsPerWeekMin: 3,
    workoutsPerWeekMax: 3,
    tags: JSON.stringify(['beginner', 'running', 'cardio']),
    requiredEquipment: JSON.stringify(['none']),
    structureJson: JSON.stringify({ weeks: [] }),
    rulesJson: JSON.stringify({}),
    isPublic: true,
    isFeatured: true,
    isVerified: true,
    ratingAverage: 4.5,
    ratingCount: 10,
    usageCount: 100,
    version: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'plan_002',
    name: '5x5 Stronglifts',
    description: 'Classic strength building program focusing on compound movements',
    authorUserId: 'user_001',
    authorName: 'Mike Tyson',
    minExperienceLevel: 'beginner',
    maxExperienceLevel: 'advanced',
    durationType: 'variable',
    durationWeeksMin: 10,
    durationWeeksMax: 12,
    frequencyType: 'flexible',
    workoutsPerWeekMin: 3,
    workoutsPerWeekMax: 3,
    tags: JSON.stringify(['intermediate', 'strength', 'compound']),
    requiredEquipment: JSON.stringify(['barbell', 'squat_rack']),
    structureJson: JSON.stringify({ weeks: [] }),
    rulesJson: JSON.stringify({}),
    isPublic: true,
    isFeatured: true,
    isVerified: true,
    ratingAverage: 4.8,
    ratingCount: 8,
    usageCount: 85,
    version: 1,
    createdAt: now + 1000,
    updatedAt: now + 1000,
  },
];

const ratings: NewTemplateRating[] = [
  {
    id: 'rating_001',
    templateId: 'plan_001',
    userId: 'user_002',
    rating: 5,
    reviewText: 'Great for beginners! Really helped me get started with running.',
    createdAt: now,
  },
  {
    id: 'rating_002',
    templateId: 'plan_002',
    userId: 'user_003',
    rating: 5,
    reviewText: 'The classic! Builds serious strength if you stick with it.',
    createdAt: now + 500,
  },
];

const tags: NewTemplateTag[] = [
  { id: 'tag_001', templateId: 'plan_001', tag: 'beginner' },
  { id: 'tag_002', templateId: 'plan_001', tag: 'running' },
  { id: 'tag_003', templateId: 'plan_002', tag: 'strength' },
  { id: 'tag_004', templateId: 'plan_002', tag: 'intermediate' },
];

/**
 * Seeds the Static Content database using Drizzle ORM and D1Helper.
 */
export async function seedStaticContent() {
  console.log('🌱 Seeding Static Content database with Drizzle ORM...');

  // Use D1Helper to get the database binding
  const d1Helper = D1Helper.get('DB_STATIC_CONTENT');

  try {
    // Execute the seeding logic using the D1 binding
    await d1Helper.useLocalD1(async ({ $client: rawD1 }) => {
      // Initialize the type-safe Drizzle client
      const db = drizzle(rawD1);

      console.log('  - Clearing existing data...');
      // Use Drizzle ORM for clear operations
      await db.delete(templateTags);
      await db.delete(templateRatings);
      await db.delete(planTemplates);

      // --- 2. Insert Data ---

      console.log(`  - Inserting ${plans.length} plan templates...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(planTemplates).values(plans);

      console.log(`  - Inserting ${ratings.length} template ratings...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(templateRatings).values(ratings);

      console.log(`  - Inserting ${tags.length} template tags...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(templateTags).values(tags);
    });

    console.log('✅ Static Content database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Static Content database:', error);
    throw error;
  }
}

// This block makes the script runnable directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedStaticContent().catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}

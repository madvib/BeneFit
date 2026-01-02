import { drizzle } from 'drizzle-orm/d1';
import { SEED_USER_IDS } from '@bene/shared';
import {
  activityFeed,
  NewActivityFeedItem,
} from '../../../src/d1/activity_stream/schema/activity_feed.js';
import {
  activityReactions,
  NewActivityReaction,
} from '../../../src/d1/activity_stream/schema/activity_reactions.js';
import { useLocalD1 } from '../../../../../tools/drizzle/get-d1-helper.ts';

const now = Math.floor(Date.now() / 1000);
// Use your schema types for type safety
const feedItems: NewActivityFeedItem[] = [
  {
    id: 'feed_001',
    ownerId: SEED_USER_IDS.USER_002,
    creatorId: SEED_USER_IDS.USER_001,
    teamId: null,
    activityType: 'workout_completed',
    contentJson: JSON.stringify({
      title: 'Leg Day Destruction',
      duration: 3600,
      calories: 450,
    }),
    visibility: 'public',
    createdAt: new Date(), // Use Date object instead of number
  },
  {
    id: 'feed_002',
    ownerId: SEED_USER_IDS.USER_003,
    creatorId: SEED_USER_IDS.USER_002,
    teamId: 'team_001',
    activityType: 'streak_milestone',
    contentJson: JSON.stringify({ days: 30 }),
    visibility: 'team',
    createdAt: new Date((now + 1000) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 'feed_003',
    ownerId: SEED_USER_IDS.USER_001,
    creatorId: SEED_USER_IDS.USER_003,
    teamId: null,
    activityType: 'pr_achieved',
    contentJson: JSON.stringify({ exercise: 'Bench Press', weight: 100, unit: 'kg' }),
    visibility: 'public',
    createdAt: new Date((now + 2000) * 1000), // Convert Unix timestamp to Date
  },
];

const reactions: NewActivityReaction[] = [
  {
    id: 'react_001',
    feedItemId: 'feed_001',
    userId: SEED_USER_IDS.USER_003,
    emoji: '🔥',
    createdAt: new Date((now + 100) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 'react_002',
    feedItemId: 'feed_001',
    userId: SEED_USER_IDS.USER_002,
    emoji: '👏',
    createdAt: new Date((now + 500) * 1000), // Convert Unix timestamp to Date
  },
];

/**
 * Seeds the Activity Stream database using Drizzle ORM and D1Helper.
 */
export async function seedActivityStream() {
  console.log('🌱 Seeding Activity Stream database with Drizzle ORM...');

  try {
    // Execute the seeding logic using the D1 binding
    await useLocalD1('DB_ACTIVITY_STREAM', async (binding) => {
      const db = drizzle(binding);

      console.log('  - Clearing existing data...');

      // Use Drizzle ORM for clear operations
      await db.delete(activityReactions);
      await db.delete(activityFeed);

      // --- 2. Insert Data ---

      console.log(`  - Inserting ${feedItems.length} activity feed items...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(activityFeed).values(feedItems);

      console.log(`  - Inserting ${reactions.length} reactions...`);
      // Use Drizzle ORM for batch insertion
      await db.insert(activityReactions).values(reactions);
    });

    console.log('✅ Activity Stream database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Activity Stream database:', error);
    throw error;
  }
}

// This block makes the script runnable directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedActivityStream().catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
}

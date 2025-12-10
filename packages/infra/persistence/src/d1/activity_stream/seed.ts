import { D1Helper } from "@nerdfolio/drizzle-d1-helpers";
import { activityFeed, NewActivityFeedItem } from "./schema/activity_feed.js";
import { activityReactions, NewActivityReaction } from "./schema/activity_reactions.js";
import { drizzle } from "drizzle-orm/d1";


const now = Math.floor(Date.now() / 1000);
// Use your schema types for type safety
const feedItems: NewActivityFeedItem[] = [
  {
    id: 'feed_001',
    ownerId: 'user_002',
    creatorId: 'user_001',
    teamId: null,
    activityType: 'workout_completed',
    contentJson: JSON.stringify({ title: "Leg Day Destruction", duration: 3600, calories: 450 }),
    visibility: 'public',
    createdAt: Date.now(),
  },
  {
    id: 'feed_002',
    ownerId: 'user_003',
    creatorId: 'user_002',
    teamId: 'team_001',
    activityType: 'streak_milestone',
    contentJson: JSON.stringify({ days: 30 }),
    visibility: 'team',
    createdAt: now + 1000,
  },
  {
    id: 'feed_003',
    ownerId: 'user_001',
    creatorId: 'user_003',
    teamId: null,
    activityType: 'pr_achieved',
    contentJson: JSON.stringify({ exercise: "Bench Press", weight: 100, unit: "kg" }),
    visibility: 'public',
    createdAt: now + 2000,
  },
];

const reactions: NewActivityReaction[] = [
  {
    id: 'react_001',
    feedItemId: 'feed_001',
    userId: 'user_003',
    emoji: '🔥',
    createdAt: now + 100,
  },
  {
    id: 'react_002',
    feedItemId: 'feed_001',
    userId: 'user_002',
    emoji: '👏',
    createdAt: now + 500,
  },
];


/**
 * Seeds the Activity Stream database using Drizzle ORM and D1Helper.
 */
export async function seedActivityStream() {
  console.log('🌱 Seeding Activity Stream database with Drizzle ORM...');
  
  // Use D1Helper to get the database binding
  const d1Helper = D1Helper.get('DB_ACTIVITY_STREAM');

  try {
    // Execute the seeding logic using the D1 binding
    await d1Helper.useLocalD1(async ({$client: rawD1}) => {
      // Initialize the type-safe Drizzle client
      const db = drizzle(rawD1); 

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
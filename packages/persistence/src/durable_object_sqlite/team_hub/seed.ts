import { createDOClient } from '../../client.js';
import { SEED_USER_IDS } from '@bene/shared';
import { team, NewTeam } from './schema/team.js';
import { teamMembers, NewTeamMember } from './schema/team_members.js';
import { teamChallenges, NewTeamChallenge } from './schema/team_challenges.js';
import { chatMessages, NewChatMessage } from './schema/chat_messages.js';

const now = Date.now();

// Use your schema types for type safety
const teams: NewTeam[] = [
  {
    id: 'team_001',
    name: 'Morning Runners',
    isPublic: true,
    latestChatMessageId: 5,
    lastUpdated: new Date(now * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 'team_002',
    name: 'Powerlifters Unite',
    isPublic: true,
    latestChatMessageId: 3,
    lastUpdated: new Date((now + 100) * 1000), // Convert Unix timestamp to Date
  },
];

const members: NewTeamMember[] = [
  {
    teamId: 'team_001',
    userId: SEED_USER_IDS.USER_001,
    role: 'member',
    joinedAt: new Date(now - 86400),
  }, // 1 day ago
  {
    teamId: 'team_001',
    userId: SEED_USER_IDS.USER_002,
    role: 'admin',
    joinedAt: new Date(now - 172800),
  }, // 2 days ago
  {
    teamId: 'team_002',
    userId: SEED_USER_IDS.USER_001,
    role: 'owner',
    joinedAt: new Date(now - 3600),
  }, // 1 hour ago
  {
    teamId: 'team_002',
    userId: SEED_USER_IDS.USER_003,
    role: 'member',
    joinedAt: new Date(now - 7200),
  }, // 2 hours ago
];

const challenges: NewTeamChallenge[] = [
  {
    id: 'challenge_001',
    teamId: 'team_001',
    name: '30-Day Running Challenge',
    description: 'Complete at least 10 runs in 30 days',
    challengeType: 'workout_count',
    startDate: new Date((now + 86400) * 1000), // Start tomorrow, convert Unix timestamp to Date
    endDate: new Date((now + 86400 + 30 * 86400) * 1000), // 30 days from tomorrow, convert Unix timestamp to Date
    status: 'active',
  },
  {
    id: 'challenge_002',
    teamId: 'team_002',
    name: 'Strength Milestone Challenge',
    description: 'Achieve a new personal record in any lift',
    challengeType: 'total_volume',
    startDate: new Date((now + 86400) * 1000), // Start tomorrow, convert Unix timestamp to Date
    endDate: new Date((now + 86400 + 45 * 86400) * 1000), // 45 days from tomorrow, convert Unix timestamp to Date
    status: 'active',
  },
];

const messages: NewChatMessage[] = [
  {
    id: 1,
    userId: SEED_USER_IDS.USER_002,
    content: 'Hey team! Ready for the morning run?',
    createdAt: new Date((now - 3600) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 2,
    userId: SEED_USER_IDS.USER_001,
    content: 'Absolutely! See you at 6am.',
    createdAt: new Date((now - 3500) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 3,
    userId: SEED_USER_IDS.USER_003,
    content: 'Count me in for the lifting session later',
    createdAt: new Date((now - 1800) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 4,
    userId: SEED_USER_IDS.USER_001,
    content: "Great! Don't forget to hydrate",
    createdAt: new Date((now - 1700) * 1000), // Convert Unix timestamp to Date
  },
  {
    id: 5,
    userId: SEED_USER_IDS.USER_002,
    content: 'Thanks for the reminder!',
    createdAt: new Date((now - 1600) * 1000), // Convert Unix timestamp to Date
  },
];

/**
 * Seeds the Team Hub database using Drizzle ORM and Durable Object Storage.
 * @param storage - The DurableObjectStorage instance to seed
 */
export async function seedTeamHub(storage: DurableObjectStorage) {
  console.log('🌱 Seeding Team Hub database with Drizzle ORM...');

  // Create the Drizzle client using the provided storage
  const db = createDOClient(storage);

  try {
    console.log('  - Clearing existing data...');
    // Use Drizzle ORM for clear operations
    await db.delete(chatMessages);
    await db.delete(teamChallenges);
    await db.delete(teamMembers);
    await db.delete(team);

    // Insert data
    console.log(`  - Inserting ${teams.length} teams...`);
    await db.insert(team).values(teams);

    console.log(`  - Inserting ${members.length} team members...`);
    await db.insert(teamMembers).values(members);

    console.log(`  - Inserting ${challenges.length} team challenges...`);
    await db.insert(teamChallenges).values(challenges);

    console.log(`  - Inserting ${messages.length} chat messages...`);
    await db.insert(chatMessages).values(messages);

    console.log('✅ Team Base database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Team Base database:', error);
    throw error;
  }
}

import { createDOClient } from '../../client.js';
import { team, NewTeam } from './schema/team.js';
import { teamMembers, NewTeamMember } from './schema/team_members.js';
import { teamChallenges, NewTeamChallenge } from './schema/team_challenges.js';
import { chatMessages, NewChatMessage } from './schema/chat_messages.js';

const now = Math.floor(Date.now() / 1000);

// Use your schema types for type safety
const teams: NewTeam[] = [
  {
    id: 'team_001',
    name: 'Morning Runners',
    isPublic: true,
    latestChatMessageId: 5,
    lastUpdated: now,
  },
  {
    id: 'team_002',
    name: 'Powerlifters Unite',
    isPublic: true,
    latestChatMessageId: 3,
    lastUpdated: now + 100,
  },
];

const members: NewTeamMember[] = [
  { teamId: 'team_001', userId: 'user_001', role: 'member', joinedAt: now - 86400 }, // 1 day ago
  { teamId: 'team_001', userId: 'user_002', role: 'admin', joinedAt: now - 172800 }, // 2 days ago
  { teamId: 'team_002', userId: 'user_001', role: 'owner', joinedAt: now - 3600 }, // 1 hour ago
  { teamId: 'team_002', userId: 'user_003', role: 'member', joinedAt: now - 7200 }, // 2 hours ago
];

const challenges: NewTeamChallenge[] = [
  {
    id: 'challenge_001',
    teamId: 'team_001',
    name: '30-Day Running Challenge',
    description: 'Complete at least 10 runs in 30 days',
    challengeType: 'workout_count',
    startDate: now + 86400, // Start tomorrow
    endDate: now + 86400 + 30 * 86400, // 30 days from tomorrow
    status: 'active',
  },
  {
    id: 'challenge_002',
    teamId: 'team_002',
    name: 'Strength Milestone Challenge',
    description: 'Achieve a new personal record in any lift',
    challengeType: 'total_volume',
    startDate: now + 86400, // Start tomorrow
    endDate: now + 86400 + 45 * 86400, // 45 days from tomorrow
    status: 'active',
  },
];

const messages: NewChatMessage[] = [
  {
    id: 1,
    userId: 'user_002',
    content: 'Hey team! Ready for the morning run?',
    createdAt: now - 3600,
  },
  {
    id: 2,
    userId: 'user_001',
    content: 'Absolutely! See you at 6am.',
    createdAt: now - 3500,
  },
  {
    id: 3,
    userId: 'user_003',
    content: 'Count me in for the lifting session later',
    createdAt: now - 1800,
  },
  {
    id: 4,
    userId: 'user_001',
    content: "Great! Don't forget to hydrate",
    createdAt: now - 1700,
  },
  {
    id: 5,
    userId: 'user_002',
    content: 'Thanks for the reminder!',
    createdAt: now - 1600,
  },
];

/**
 * Seeds the Team Base database using Drizzle ORM and Durable Object Storage.
 * @param storage - The DurableObjectStorage instance to seed
 */
export async function seedTeamBase(storage: DurableObjectStorage) {
  console.log('🌱 Seeding Team Base database with Drizzle ORM...');

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

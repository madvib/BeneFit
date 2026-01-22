import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import {
  createWorkoutSessionFixture,
  createSessionParticipantFixture,
  createSessionFeedItemFixture
} from '@bene/training-core/fixtures';
import { SEED_USERS } from '@bene/shared';
import * as schema from './schema/index.js';
import { toDatabase, toParticipantDatabase, toChatDatabase } from '../mappers/workout-session.mapper.js';

/**
 * Seeds the Workout Session database using Drizzle ORM.
 * This is a dynamic alternative to static seed-data files.
 * 
 * Works with both LibSQL (tests) and DurableObjectSQLite (staging)
 */
export async function seedWorkoutSession(db: BaseSQLiteDatabase<'async' | 'sync', unknown, typeof schema>) {
  console.log('🌱 Seeding Workout Session Data (Fixture-based)...');

  try {
    // Clear all data first for a clean seed
    console.log('  - Clearing existing data...');
    await db.delete(schema.sessionChat);
    await db.delete(schema.activityProgress);
    await db.delete(schema.participants);
    await db.delete(schema.sessionMetadata);

    // Seed for first user (DO normally handles one session)
    const user = SEED_USERS[0];
    console.log(`  - Seeding session for user: ${ user.name } (${ user.id })`);

    // 1. Create Workout Session
    const session = createWorkoutSessionFixture({
      ownerId: user.id,
      state: 'in_progress',
    });
    const sessionDb = toDatabase(session);
    await db.insert(schema.sessionMetadata).values(sessionDb).onConflictDoNothing();

    // 2. Add Participants
    const ownerParticipant = createSessionParticipantFixture({
      userId: user.id,
      userName: user.name,
      role: 'owner',
      status: 'active',
    });
    const ownerDb = toParticipantDatabase(ownerParticipant);
    await db.insert(schema.participants).values(ownerDb).onConflictDoNothing();

    // Add another participant
    const otherUser = SEED_USERS[1];
    const otherParticipant = createSessionParticipantFixture({
      userId: otherUser.id,
      userName: otherUser.name,
      role: 'participant',
      status: 'active',
    });
    const otherDb = toParticipantDatabase(otherParticipant);
    await db.insert(schema.participants).values(otherDb).onConflictDoNothing();

    // 3. Add some chat messages
    const chatItem = createSessionFeedItemFixture({
      type: 'chat_message',
      userId: otherUser.id,
      userName: otherUser.name,
      content: 'Let\'s go!',
    });

    const chatDb = toChatDatabase(session.id, otherDb.id, chatItem);
    await db.insert(schema.sessionChat).values(chatDb).onConflictDoNothing();

    console.log('✅ Seed Complete');

  } catch (error) {
    console.error('❌ Seed Failed:', error);
    throw error;
  }
}

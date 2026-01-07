import { drizzle } from 'drizzle-orm/durable-sqlite';
import { sessionMetadata, NewSessionMetadata } from './schema/session_metadata.js';
import { participants, NewParticipant } from './schema/participants.js';
import { activityProgress, NewActivityProgress } from './schema/activity_progress.js';
import { sessionChat, NewSessionChat } from './schema/session_chat.js';

import { SEED_USER_IDS, SEED_USERS } from '@bene/shared';

const now = Math.floor(Date.now() / 1000);

// Use your schema types for type safety
const sessions: NewSessionMetadata[] = [
  {
    id: 'session_001',
    createdByUserId: SEED_USER_IDS.USER_001,
    workoutId: 'workout_001',
    planId: 'plan_001',
    workoutTemplateId: 'wt_001',
    workoutType: 'strength',
    activitiesJson: [
      { name: 'Squats', sets: 5, reps: 5, weightKg: 100 },
      { name: 'Bench Press', sets: 4, reps: 6, weightKg: 80 },
    ],
    configurationJson: { privacy: 'private', capacity: 10 },
    status: 'in_progress',
    startedAt: new Date((now - 3600) * 1000), // Started 1 hour ago
    createdAt: new Date((now - 3600) * 1000),
    updatedAt: new Date(now * 1000),
  },
  {
    id: 'session_002',
    createdByUserId: SEED_USER_IDS.USER_002,
    workoutId: 'workout_002',
    planId: 'plan_002',
    workoutTemplateId: 'wt_002',
    workoutType: 'cardio',
    activitiesJson: [
      { name: 'Warm-up', duration: 15, type: 'easy_jog' },
      { name: 'Intervals', details: '6 x 800m @ 5K pace', type: 'intervals' },
      { name: 'Cool-down', duration: 15, type: 'easy_jog' },
    ],
    configurationJson: { privacy: 'public', capacity: 20 },
    status: 'in_progress',
    startedAt: new Date((now - 1800) * 1000), // Started 30 minutes ago
    createdAt: new Date((now - 1800) * 1000),
    updatedAt: new Date(now * 1000),
  },
];

const participantsData: NewParticipant[] = SEED_USERS
  .filter(u => u.id !== SEED_USER_IDS.USER_003) // Exclude USER_003 (Empty State)
  .map((u, index) => ({
    id: `part_00${ index + 1 }`,
    userId: u.id,
    displayName: u.name,
    avatarUrl: u.avatarUrl,
    joinedAt: new Date((now - (3600 - (index * 100))) * 1000),
    lastHeartbeatAt: new Date((now - (60 * (index + 1))) * 1000),
    status: 'active',
  }));

const progress: NewActivityProgress[] = [
  {
    id: 'ap_001',
    participantId: 'part_001',
    activityId: 'act_001',
    activityName: 'Squats',
    orderIndex: 0,
    currentSet: 3,
    currentRep: 5,
    currentWeight: 100,
    status: 'in_progress',
    startedAt: new Date((now - 1800) * 1000),
    updatedAt: new Date((now - 60) * 1000),
  },
  {
    id: 'ap_002',
    participantId: 'part_002',
    activityId: 'act_002',
    activityName: 'Running Intervals',
    orderIndex: 1,
    currentDistanceMeters: 800,
    currentHeartRate: 155,
    status: 'in_progress',
    startedAt: new Date((now - 1200) * 1000),
    updatedAt: new Date((now - 120) * 1000),
  },
  // Removed progress for part_003 (USER_003)
];

const chat: NewSessionChat[] = [
  {
    id: 'chat_001',
    participantId: 'part_001',
    message: 'Hey everyone! Ready to crush this leg day?',
    createdAt: new Date((now - 3500) * 1000),
  },
  {
    id: 'chat_002',
    participantId: 'part_002',
    message: 'Absolutely! I brought my pre-workout!',
    createdAt: new Date((now - 3400) * 1000),
  },
  // Removed chat from part_003
  {
    id: 'chat_004',
    participantId: 'part_001',
    message: "In the squat rack area, we'll start with warm-up sets",
    createdAt: new Date((now - 1750) * 1000),
  },
  // Removed chat_005 from part_003
];

/**
 * Seeds the Workout Session database using Drizzle ORM and Durable Object Storage.
 * @param storage - The DurableObjectStorage instance to seed
 */
export async function seedWorkoutSession(storage: DurableObjectStorage) {
  console.log('🌱 Seeding Workout Session database with Drizzle ORM...');

  // Create the Drizzle client using the provided storage
  const db = drizzle(storage);

  try {
    console.log('  - Clearing existing data...');
    // Use Drizzle ORM for clear operations
    await db.delete(sessionChat);
    await db.delete(activityProgress);
    await db.delete(participants);
    await db.delete(sessionMetadata);

    // Insert data
    console.log(`  - Inserting ${ sessions.length } session metadata...`);
    const existing = await db.select().from(sessionMetadata).limit(1);
    if (existing.length === 0) {
      await db.insert(sessionMetadata).values(sessions);
    }

    console.log(`  - Inserting ${ participantsData.length } participants...`);
    await db.insert(participants).values(participantsData);

    console.log(`  - Inserting ${ progress.length } activity progress records...`);
    await db.insert(activityProgress).values(progress);

    console.log(`  - Inserting ${ chat.length } chat messages...`);
    await db.insert(sessionChat).values(chat);

    console.log('✅ Workout Session database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding Workout Session database:', error);
    throw error;
  }
}

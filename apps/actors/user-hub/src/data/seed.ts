import { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { SEED_USERS, SEED_PERSONAS } from '@bene/shared';
import {
  createCompletedWorkoutFixture,
  createFitnessPlanFixture,
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { createCoachConversationFixture } from '@bene/coach-domain/fixtures';
import { createConnectedServiceFixture } from '@bene/integrations-domain/fixtures';
import { PlanType } from '@bene/training-core';
import * as schema from './schema/index.js';
import {
  toProfileDatabase as profileToDb,
  toStatsDatabase,
  achievementToDatabase,
} from '../mappers/user-profile.mapper.js';
import { toDatabase as workoutToDb } from '../mappers/completed-workout.mapper.js';
import { toDatabase as planToDb } from '../mappers/workout-plan.mapper.js';
import { toDatabase as coachConvToDb } from '../mappers/coach-conversation.mapper.js';
import { toDatabase as serviceToDb } from '../mappers/connected-service.mapper.js';

/**
 * Seed script using Domain Fixtures and Mappers.
 * This is a dynamic alternative to static seed-data files.
 * 
 * Works with both LibSQL (tests) and DurableObjectSQLite (staging)
 */
export async function seedUserHub(db: BaseSQLiteDatabase<'async' | 'sync', unknown, typeof schema>) {
  console.log('🌱 Seeding User Hub Data (Fixture-based)...');

  try {
    // Clear all data first for a clean seed
    console.log('  - Clearing existing data...');
    await db.delete(schema.activeFitnessPlan);
    await db.delete(schema.weeklySchedules);
    await db.delete(schema.workoutTemplates);
    await db.delete(schema.workoutActivities);
    await db.delete(schema.completedWorkouts);
    await db.delete(schema.achievements);
    await db.delete(schema.userStats);
    await db.delete(schema.profile);
    await db.delete(schema.checkIns);
    await db.delete(schema.coachingMessages);
    await db.delete(schema.coachingConversation);
    await db.delete(schema.connectedServices);

    for (const user of SEED_USERS) {
      console.log(`  - Seeding user: ${ user.name } (${ user.id })`);
      const persona = SEED_PERSONAS[user.id as keyof typeof SEED_PERSONAS];

      // ==========================================
      // 1. User Profile & Core Data
      // ==========================================
      const profileDomain = createUserProfileFixture({
        userId: user.id,
        displayName: user.name,
        avatar: user.avatarUrl
      });
      const profileDb = profileToDb(profileDomain);
      const statsDb = toStatsDatabase(profileDomain);

      await db.insert(schema.profile).values(profileDb);
      await db.insert(schema.userStats).values(statsDb);

      if (profileDomain.stats.achievements && profileDomain.stats.achievements.length > 0) {
        const achievementsDb = profileDomain.stats.achievements.map((a) => achievementToDatabase(user.id, a));
        await db.insert(schema.achievements).values(achievementsDb);
      }

      // ==========================================
      // 2. Coach Domain
      // ==========================================
      // Only seed for users who might have conversations in personas (or just all for now)
      const conversation = createCoachConversationFixture({
        userId: user.id,
        totalMessages: 5,
      });
      const conversationDb = coachConvToDb(conversation);
      await db.insert(schema.coachingConversation).values(conversationDb);

      // ==========================================
      // 3. Integrations
      // ==========================================
      // Seed a service for users who have it
      if (user.id === SEED_USERS[0].id || user.id === SEED_USERS[1].id) {
        const service = createConnectedServiceFixture({
          userId: user.id,
          serviceType: user.id === SEED_USERS[0].id ? 'strava' : 'garmin',
        });
        const serviceDb = serviceToDb(service);
        await db.insert(schema.connectedServices).values(serviceDb);
      }

      // ==========================================
      // 4. Training (Workouts & Plans)
      // ==========================================
      // Seed workouts if they have them in persona or just seed 1 for everyone
      if (user.id !== SEED_USERS[2].id) { // USER_003 is the "empty" user in repository tests
        const workout = createCompletedWorkoutFixture({
          userId: user.id,
          workoutType: 'strength',
          description: 'Fixture generated workout',
        });
        const workoutDb = workoutToDb(workout);
        await db.insert(schema.completedWorkouts).values(workoutDb);
      }

      if (persona.plan) {
        const plan = createFitnessPlanFixture({
          userId: user.id,
          title: persona.plan.title as string,
          status: persona.plan.status,
          planType: persona.plan.type as PlanType,
        });
        const planDb = planToDb(plan);
        await db.insert(schema.activeFitnessPlan).values(planDb);
      }
    }

    console.log('✅ Seed Complete');

  } catch (error) {
    console.error('❌ Seed Failed:', error);
    throw error;
  }
}

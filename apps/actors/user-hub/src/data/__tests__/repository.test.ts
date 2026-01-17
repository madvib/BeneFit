import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedUserHub } from '../seed.js';
import { SEED_USER_IDS, SEED_PERSONAS } from '@bene/shared';
import { DurableUserProfileRepository } from '../../repositories/durable-user-profile.repository.js';
import { DurableFitnessPlanRepository } from '../../repositories/durable-fitness-plan.repository.js';
import { DurableCompletedWorkoutRepository } from '../../repositories/durable-completed-workout.repository.js';

describe('Comprehensive Repository Testing', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  let userRepo: DurableUserProfileRepository;
  let planRepo: DurableFitnessPlanRepository;
  let workoutRepo: DurableCompletedWorkoutRepository;

  beforeEach(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
    await seedUserHub(db);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userRepo = new DurableUserProfileRepository(db as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    planRepo = new DurableFitnessPlanRepository(db as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workoutRepo = new DurableCompletedWorkoutRepository(db as any);
  });

  afterEach(() => {
    client?.close();
  });

  // Iterate over all Seed Users to verify baseline existence
  Object.values(SEED_USER_IDS).forEach((userId) => {
    const persona = SEED_PERSONAS[userId as keyof typeof SEED_PERSONAS];

    describe(`Persona: ${ persona.role } (${ userId })`, () => {
      // 1. User Profile Repository Tests
      describe('UserProfileRepository', () => {
        it('findById: should return profile', async () => {
          const result = await userRepo.findById(userId);
          expect(result.isSuccess).toBe(true);
          expect(result.value.userId).toBe(userId);
        });

        // Save and Delete would modify state, so we test them carefully or last
        it('save: should update profile successfully', async () => {
          const result = await userRepo.findById(userId);
          const profile = { ...result.value, bio: 'Updated Bio' };
          const saveResult = await userRepo.save(profile);
          expect(saveResult.isSuccess).toBe(true);

          const verify = await userRepo.findById(userId);
          expect(verify.value.bio).toBe('Updated Bio');
        });
      });

      // 2. Fitness Plan Repository Tests
      describe('FitnessPlanRepository', () => {
        if (persona.plan) {
          it(`findActiveByUserId: should return ${ persona.plan.status } plan`, async () => {
            const result = await planRepo.findActiveByUserId(userId);

            if (persona.plan!.status === 'active') {
              expect(result.isSuccess).toBe(true);
              expect(result.value.planType).toBe(persona.plan!.type);
            } else {
              // If plan is paused or completed, it might not be returned by "findActive" 
              // depending on implementation. 
              // Based on implementation, findActive filters for status='active'.
              expect(result.isFailure).toBe(true);
              expect(result.errorMessage).toContain('not found');
            }
          });

          it('findByUserId: should return all plans', async () => {
            const result = await planRepo.findByUserId(userId);
            expect(result.isSuccess).toBe(true);
            expect(result.value.length).toBeGreaterThan(0);
            expect(result.value[0].title).toBe(persona.plan!.title);
          });
        } else {
          it('findActiveByUserId: should return nothing (no plan)', async () => {
            const result = await planRepo.findActiveByUserId(userId);
            expect(result.isFailure).toBe(true);
            expect(result.errorMessage).toContain('not found');
          });

          it('findByUserId: should return empty list', async () => {
            const result = await planRepo.findByUserId(userId);
            // Assuming implementation returns empty array or fails? 
            // Let's check consistency. Usually returns empty array for "find all"
            expect(result.isSuccess).toBe(true);
            // Note: seed might create historical plans, but for USER_003 specifically we expect strict empty
            if (userId === SEED_USER_IDS.USER_003) {
              expect(result.value.length).toBe(0);
            }
          });
        }
      });

      // 3. Completed Workout Repository Tests
      describe('CompletedWorkoutRepository', () => {
        it('countByUserId: should return correct count type', async () => {
          const result = await workoutRepo.countByUserId(userId);
          expect(result.isSuccess).toBe(true);
          expect(typeof result.value).toBe('number');
        });

        it('findByUserId: should return workouts list', async () => {
          const result = await workoutRepo.findByUserId(userId);
          expect(result.isSuccess).toBe(true);
          expect(Array.isArray(result.value)).toBe(true);
        });

        if (persona.plan?.status === 'active') {
          // Test findRecent only for active users who likely have recent data
          it('findRecentByUserId: should return recent workouts', async () => {
            const result = await workoutRepo.findRecentByUserId(userId, 30);
            expect(result.isSuccess).toBe(true);
          });
        }
      });
    });
  });

  // Explicit Edge Case: USER_003 (Powerlifter) - The "Empty" User
  describe('Special Scenario: USER_003 (Empty State)', () => {
    it('should enforce strict empty state for plans', async () => {
      const plans = await planRepo.findByUserId(SEED_USER_IDS.USER_003);
      expect(plans.value).toHaveLength(0);
    });
  });
});
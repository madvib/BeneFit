import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { Result, EntityNotFoundError, QueryError, SaveError } from '@bene/shared';
import type { CompletedWorkout } from '@bene/training-core';
import type { CompletedWorkoutRepository } from '@bene/training-application';

import { toDomain, toDatabase } from '../mappers/completed-workout.mapper';
import { completedWorkouts, user_do_schema, workoutReactions } from '../data/schema';

export class DurableCompletedWorkoutRepository implements CompletedWorkoutRepository {
  constructor(private db: DrizzleSqliteDODatabase<typeof user_do_schema>) { }

  async findById(workoutId: string): Promise<Result<CompletedWorkout>> {
    try {
      const result = await this.db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, workoutId),
        with: {
          reactions: true,
        },
      });

      if (!result) {
        return Result.fail(new EntityNotFoundError('CompletedWorkout', workoutId));
      }

      const workout = toDomain(result);
      return Result.ok(workout);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'CompletedWorkout',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findByUserId(
    userId: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Result<CompletedWorkout[]>> {
    try {
      const results = await this.db.query.completedWorkouts.findMany({
        where: eq(completedWorkouts.userId, userId),
        with: {
          reactions: true,
        },
        orderBy: [desc(completedWorkouts.recordedAt)],
        limit,
        offset,
      });

      const workouts = results.map((r) => toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find by user',
          'CompletedWorkouts',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findByPlanId(planId: string): Promise<Result<CompletedWorkout[]>> {
    try {
      const results = await this.db.query.completedWorkouts.findMany({
        where: eq(completedWorkouts.planId, planId),
        with: {
          reactions: true,
        },
        orderBy: [desc(completedWorkouts.recordedAt)],
      });

      const workouts = results.map((r) => toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find by plan',
          'CompletedWorkouts',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findRecentByUserId(
    userId: string,
    days: number,
  ): Promise<Result<CompletedWorkout[]>> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const results = await this.db.query.completedWorkouts.findMany({
        where: and(
          eq(completedWorkouts.userId, userId),
          gte(completedWorkouts.recordedAt, cutoffDate),
        ),
        with: {
          reactions: true,
        },
        orderBy: [desc(completedWorkouts.recordedAt)],
      });

      const workouts = results.map((r) => toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find recent',
          'CompletedWorkouts',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(workout: CompletedWorkout): Promise<Result<void>> {
    try {
      const row = toDatabase(workout);

      await this.db.insert(completedWorkouts).values(row).onConflictDoUpdate({
        target: completedWorkouts.id,
        set: row,
      });

      await this.db
        .delete(workoutReactions)
        .where(eq(workoutReactions.workoutId, workout.id));

      if (workout.reactions.length > 0) {
        await this.db.insert(workoutReactions).values(
          workout.reactions.map((r) => ({
            id: r.id,
            workoutId: workout.id,
            userId: r.userId,
            userName: r.userName,
            reactionType: r.type,
            createdAt: r.createdAt,
          })),
        );
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'CompletedWorkout',
          workout.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async countByUserId(userId: string): Promise<Result<number>> {
    try {
      const result = await this.db
        .select({ count: sql<number>`COUNT(*)` })
        .from(completedWorkouts)
        .where(eq(completedWorkouts.userId, userId));

      return Result.ok(Number(result[0]?.count) || 0);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'count',
          'CompletedWorkouts',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}

import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { Result } from '@bene/domain';
import type { CompletedWorkout } from '@bene/domain/workouts';
import type { CompletedWorkoutRepository } from '@bene/application/workouts';
import type { DbClient } from '@bene/database';
import { completedWorkouts, workoutReactions } from '@bene/database/schema';

export class D1CompletedWorkoutRepository implements CompletedWorkoutRepository {
  constructor(private db: DbClient) {}

  async findById(workoutId: string): Promise<Result<CompletedWorkout>> {
    try {
      // Use relational query to get workout with reactions
      const result = await this.db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, workoutId),
        with: {
          reactions: true,
        },
      });

      if (!result) {
        return Result.fail(`Workout ${workoutId} not found`);
      }

      const workout = this.toDomain(result);
      return Result.ok(workout);
    } catch (error) {
      return Result.fail(`Failed to find workout: ${error}`);
    }
  }

  async findByUserId(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Result<CompletedWorkout[]>> {
    try {
      const limit = options?.limit || 20;
      const offset = options?.offset || 0;

      const results = await this.db.query.completedWorkouts.findMany({
        where: eq(completedWorkouts.userId, userId),
        with: {
          reactions: true,
        },
        orderBy: [desc(completedWorkouts.recordedAt)],
        limit,
        offset,
      });

      const workouts = results.map((r) => this.toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(`Failed to find workouts: ${error}`);
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

      const workouts = results.map((r) => this.toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(`Failed to find workouts: ${error}`);
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

      const workouts = results.map((r) => this.toDomain(r));
      return Result.ok(workouts);
    } catch (error) {
      return Result.fail(`Failed to find recent workouts: ${error}`);
    }
  }

  async save(workout: CompletedWorkout): Promise<Result<void>> {
    try {
      const row = this.toDatabase(workout);

      // Save workout
      await this.db.insert(completedWorkouts).values(row).onConflictDoUpdate({
        target: completedWorkouts.id,
        set: row,
      });

      // Save reactions separately (delete + insert for simplicity)
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
      return Result.fail(`Failed to save workout: ${error}`);
    }
  }

  async countByUserId(userId: string): Promise<Result<number>> {
    try {
      const result = await this.db
        .select({ count: sql`COUNT(*)`.as('count') })
        .from(completedWorkouts)
        .where(eq(completedWorkouts.userId, userId));

      return Result.ok(result[0].count as number);
    } catch (error) {
      return Result.fail(`Failed to count workouts: ${error}`);
    }
  }

  // MAPPERS

  private toDomain(row: any): CompletedWorkout {
    return {
      id: row.id,
      userId: row.userId,
      planId: row.planId || undefined,
      workoutTemplateId: row.workoutTemplateId || undefined,
      weekNumber: row.weekNumber || undefined,
      dayNumber: row.dayNumber || undefined,
      workoutType: row.workoutType,
      description: row.description || undefined,
      performance: row.performance as any,
      verification: row.verification as any,
      reactions: (row.reactions || []).map((r: any) => ({
        id: r.id,
        userId: r.userId,
        userName: r.userName,
        type: r.reactionType,
        createdAt: r.createdAt,
      })),
      isPublic: row.isPublic,
      multiplayerSessionId: row.multiplayerSessionId || undefined,
      createdAt: row.createdAt,
      recordedAt: row.recordedAt,
    };
  }

  private toDatabase(workout: CompletedWorkout): typeof completedWorkouts.$inferInsert {
    return {
      id: workout.id,
      userId: workout.userId,
      planId: workout.planId,
      workoutTemplateId: workout.workoutTemplateId,
      weekNumber: workout.weekNumber,
      dayNumber: workout.dayNumber,
      workoutType: workout.workoutType,
      description: workout.description,
      performance: workout.performance as any,
      verification: workout.verification as any,
      isPublic: workout.isPublic,
      reactionCount: workout.reactions.length,
      multiplayerSessionId: workout.multiplayerSessionId,
      createdAt: workout.createdAt,
      recordedAt: workout.recordedAt,
    };
  }
}
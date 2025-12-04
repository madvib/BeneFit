import { eq, and, desc } from 'drizzle-orm';
import { Result } from '@bene/domain';
import type { WorkoutPlan } from '@bene/domain/planning';
import type { WorkoutPlanRepository } from '@bene/application/planning';
import type { DbClient } from '@bene/database';
import { workoutPlansMetadata } from '@bene/database/schema';

export class D1WorkoutPlanRepository implements WorkoutPlanRepository {
  constructor(private db: DbClient) {}

  async findById(planId: string): Promise<Result<WorkoutPlan>> {
    try {
      const row = await this.db
        .select()
        .from(workoutPlansMetadata)
        .where(eq(workoutPlansMetadata.id, planId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(`Workout plan ${planId} not found`);
      }

      // For full plan data, we'd need to get it from UserAgent DO
      // This only returns metadata
      const plan = this.toDomain(row[0]);
      return Result.ok(plan);
    } catch (error) {
      return Result.fail(`Failed to find workout plan: ${error}`);
    }
  }

  async findByUserId(userId: string): Promise<Result<WorkoutPlan[]>> {
    try {
      const rows = await this.db
        .select()
        .from(workoutPlansMetadata)
        .where(eq(workoutPlansMetadata.userId, userId))
        .orderBy(desc(workoutPlansMetadata.createdAt));

      const plans = rows.map(row => this.toDomain(row));
      return Result.ok(plans);
    } catch (error) {
      return Result.fail(`Failed to find workout plans: ${error}`);
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<WorkoutPlan>> {
    try {
      const row = await this.db
        .select()
        .from(workoutPlansMetadata)
        .where(
          and(
            eq(workoutPlansMetadata.userId, userId),
            eq(workoutPlansMetadata.status, 'active')
          )
        )
        .limit(1);

      if (row.length === 0) {
        return Result.fail('No active workout plan found');
      }

      const plan = this.toDomain(row[0]);
      return Result.ok(plan);
    } catch (error) {
      return Result.fail(`Failed to find active workout plan: ${error}`);
    }
  }

  async save(plan: WorkoutPlan): Promise<Result<void>> {
    try {
      const row = this.toDatabase(plan);

      // Upsert
      await this.db.insert(workoutPlansMetadata).values(row).onConflictDoUpdate({
        target: workoutPlansMetadata.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save workout plan: ${error}`);
    }
  }

  async delete(planId: string): Promise<Result<void>> {
    try {
      await this.db
        .delete(workoutPlansMetadata)
        .where(eq(workoutPlansMetadata.id, planId));

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to delete workout plan: ${error}`);
    }
  }

  // MAPPERS

  private toDomain(row: typeof workoutPlansMetadata.$inferSelect): WorkoutPlan {
    return {
      id: row.id,
      userId: row.userId,
      name: row.name,
      status: row.status as any,
      templateId: row.templateId || undefined,
      createdAt: row.createdAt,
      startedAt: row.startedAt || undefined,
      completedAt: row.completedAt || undefined,
      abandonedAt: row.abandonedAt || undefined,
      totalWeeks: row.totalWeeks,
      currentWeek: row.currentWeek,
      completedWorkouts: row.completedWorkouts,
      totalScheduledWorkouts: row.totalScheduledWorkouts,
      // Additional plan structure would come from UserAgent DO
      structure: undefined, // Placeholder - would be loaded from UserAgent DO
    };
  }

  private toDatabase(plan: WorkoutPlan): typeof workoutPlansMetadata.$inferInsert {
    return {
      id: plan.id,
      userId: plan.userId,
      name: plan.name,
      status: plan.status,
      templateId: plan.templateId,
      createdAt: plan.createdAt,
      startedAt: plan.startedAt,
      completedAt: plan.completedAt,
      abandonedAt: plan.abandonedAt,
      totalWeeks: plan.totalWeeks,
      currentWeek: plan.currentWeek,
      completedWorkouts: plan.completedWorkouts,
      totalScheduledWorkouts: plan.totalScheduledWorkouts,
    };
  }
}
import { eq, and, desc } from 'drizzle-orm';
import { Result } from '@bene/shared-domain';
import type { FitnessPlan } from '@bene/training-core';
import type { FitnessPlanRepository } from '@bene/training-application';
import type { DOClient } from '@bene/persistence';
import { activeFitnessPlan, user_do_schema } from '@bene/persistence';
import { toDomain, toDatabase } from '../mappers/workout-plan.mapper.js';
import {
  EntityNotFoundError,
  QueryError,
  SaveError,
  DeleteError,
} from '@bene/shared-infra';

export class DurableFitnessPlanRepository implements FitnessPlanRepository {
  constructor(private db: DOClient<typeof user_do_schema>) {}

  async findById(planId: string): Promise<Result<FitnessPlan>> {
    try {
      const row = await this.db
        .select()
        .from(activeFitnessPlan)
        .where(eq(activeFitnessPlan.id, planId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(new EntityNotFoundError('FitnessPlan', planId));
      }

      const plan = toDomain(row[0]!);
      return Result.ok(plan);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'FitnessPlan',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findByUserId(userId: string): Promise<Result<FitnessPlan[]>> {
    try {
      const rows = await this.db
        .select()
        .from(activeFitnessPlan)
        .where(eq(activeFitnessPlan.userId, userId))
        .orderBy(desc(activeFitnessPlan.createdAt));

      const plans = rows.map((row) => toDomain(row));
      return Result.ok(plans);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find by user',
          'FitnessPlans',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<FitnessPlan>> {
    try {
      const row = await this.db
        .select()
        .from(activeFitnessPlan)
        .where(
          and(
            eq(activeFitnessPlan.userId, userId),
            eq(activeFitnessPlan.status, 'active'),
          ),
        )
        .limit(1);

      if (row.length === 0) {
        return Result.fail(new EntityNotFoundError('Active FitnessPlan', userId));
      }

      const plan = toDomain(row[0]!);
      return Result.ok(plan);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find active',
          'FitnessPlan',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(plan: FitnessPlan): Promise<Result<void>> {
    try {
      const row = toDatabase(plan);

      await this.db.insert(activeFitnessPlan).values(row).onConflictDoUpdate({
        target: activeFitnessPlan.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'FitnessPlan',
          plan.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async delete(planId: string): Promise<Result<void>> {
    try {
      await this.db.delete(activeFitnessPlan).where(eq(activeFitnessPlan.id, planId));

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new DeleteError(
          'WorkoutPlan',
          planId,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}

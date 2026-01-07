import { eq, and } from 'drizzle-orm';
import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import {
  Result,
  QueryError,
  SaveError,
  DeleteError,
  EntityNotFoundError,
} from '@bene/shared';
import type { WorkoutSession } from '@bene/training-core';
import type { WorkoutSessionRepository } from '@bene/training-application';


import { toDatabase, toDomain } from '../mappers/workout-session.mapper.js';
import { sessionMetadata as sessionMetadataTable, workout_session_schema } from '../data/schema/index.js';

/**
 * WorkoutSession repository - uses Drizzle with Durable Object SQLite
 */
export class DurableWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private db: DrizzleSqliteDODatabase<typeof workout_session_schema>) { }

  async findById(sessionId: string): Promise<Result<WorkoutSession>> {
    try {
      const result = await this.db.query.sessionMetadata.findFirst({
        where: eq(sessionMetadataTable.id, sessionId),
      });

      if (!result) {
        return Result.fail(new EntityNotFoundError('WorkoutSession', sessionId));
      }

      const session = toDomain(result);
      return Result.ok(session);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'WorkoutSession',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<WorkoutSession>> {
    try {
      const result = await this.db.query.sessionMetadata.findFirst({
        where: and(
          eq(sessionMetadataTable.createdByUserId, userId),
          eq(sessionMetadataTable.status, 'in_progress'),
        ),
      });

      if (!result) {
        return Result.fail(
          new EntityNotFoundError(
            'WorkoutSession',
            `active session for user ${ userId }`,
          ),
        );
      }

      const session = toDomain(result);
      return Result.ok(session);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find active by user id',
          'WorkoutSession',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(session: WorkoutSession): Promise<Result<void>> {
    try {
      const row = toDatabase(session);

      await this.db
        .insert(sessionMetadataTable)
        .values(row)
        .onConflictDoUpdate({
          target: sessionMetadataTable.id,
          set: {
            ...row,
            updatedAt: new Date(), // Update the timestamp
          },
        });

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'WorkoutSession',
          session.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async delete(sessionId: string): Promise<Result<void>> {
    try {
      await this.db
        .delete(sessionMetadataTable)
        .where(eq(sessionMetadataTable.id, sessionId));

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new DeleteError(
          'WorkoutSession',
          sessionId,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}

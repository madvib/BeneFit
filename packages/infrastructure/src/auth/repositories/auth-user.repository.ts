import { IUserRepository } from '@bene/application/auth';
import { Result } from '@bene/core/shared';
import { User } from '@bene/core/auth';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { user as userTable } from '../data/schema/schema.js';
import { eq } from 'drizzle-orm';

export class AuthUserRepository implements IUserRepository {
  private db: DrizzleD1Database;

  constructor(db: DrizzleD1Database) {
    this.db = db;
  }

  async findById(id: string): Promise<Result<User>> {
    try {
      const userRecord = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .limit(1);

      if (!userRecord || userRecord.length === 0) {
        return Result.fail(new Error('User not found'));
      }

      const userData = userRecord[0];

      // Create a User entity from the database record
      const userResult = User.create({
        id: userData.id,
        email: userData.email,
        name: userData.name || undefined,
      });

      if (userResult.isFailure) {
        return Result.fail(userResult.error);
      }

      return Result.ok(userResult.value);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to find user by ID'),
      );
    }
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    try {
      const userRecord = await this.db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .limit(1);

      if (!userRecord || userRecord.length === 0) {
        return Result.ok(null);
      }

      const userData = userRecord[0];

      // Create a User entity from the database record
      const userResult = User.create({
        id: userData.id,
        email: userData.email,
        name: userData.name || undefined,
      });

      if (userResult.isFailure) {
        return Result.fail(userResult.error);
      }

      return Result.ok(userResult.value);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to find user by email'),
      );
    }
  }

  async save(user: User): Promise<Result<void>> {
    try {
      // Insert user into the database
      await this.db.insert(userTable).values({
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0], // Use email prefix as name if not provided
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to save user'),
      );
    }
  }

  async update(user: User): Promise<Result<void>> {
    try {
      // Update user in the database
      await this.db
        .update(userTable)
        .set({
          email: user.email,
          name: user.name,
          updatedAt: new Date(),
        })
        .where(eq(userTable.id, user.id));

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to update user'),
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      // Delete user from the database
      await this.db.delete(userTable).where(eq(userTable.id, id));

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        error instanceof Error ? error : new Error('Failed to delete user'),
      );
    }
  }
}

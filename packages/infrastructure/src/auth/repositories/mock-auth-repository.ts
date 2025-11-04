import { Result } from '@bene/core/shared';
import { User } from '@bene/core/auth';
import {
  IAuthRepository,
  LoginInput,
  LoginOutput,
  ResetPasswordInput,
  SignupInput,
  SignupOutput,
} from '@bene/application/auth';

/**
 * Mock implementation of Auth repository for testing
 */
export class MockAuthRepository implements IAuthRepository {
  private users: Map<string, User> = new Map();
  private emailToIdMap: Map<string, string> = new Map();

  async login(input: LoginInput): Promise<Result<LoginOutput>> {
    const userResult = await this.findByEmail(input.email);

    if (userResult.isFailure || !userResult.value) {
      return Result.fail(new Error('Invalid email or password'));
    }

    const user = userResult.value;

    // For mock purposes, we'll assume the password is correct
    return Result.ok({
      userId: user.id,
      email: user.email,
    });
  }

  async signup(input: SignupInput): Promise<Result<SignupOutput>> {
    // Check if user already exists
    const existingUserResult = await this.findByEmail(input.email);

    if (existingUserResult.isSuccess && existingUserResult.value) {
      return Result.fail(new Error('User already exists'));
    }

    // Create new user
    const userResult = User.create({
      id: `user-${Date.now()}`, // Simple ID generation for mock
      email: input.email,
    });

    if (userResult.isFailure) {
      return Result.fail(userResult.error);
    }

    const user = userResult.value;

    this.users.set(user.id, user);
    this.emailToIdMap.set(user.email, user.id);

    return Result.ok({
      userId: user.id,
      email: user.email,
      requiresEmailConfirmation: true,
    });
  }

  async resetPassword(input: ResetPasswordInput): Promise<Result<void>> {
    // For mock implementation, we'll just return success
    console.log(`input: ${input}`);
    return Result.ok(undefined);
  }

  async signOut(): Promise<Result<void>> {
    // For mock implementation, we'll just return success
    return Result.ok(undefined);
  }

  async findById(id: string): Promise<Result<User>> {
    const user = this.users.get(id);

    if (!user) {
      return Result.fail(new Error('User not found'));
    }

    return Result.ok(user);
  }

  async findByEmail(email: string): Promise<Result<User | null>> {
    const userId = this.emailToIdMap.get(email);

    if (!userId) {
      return Result.ok(null);
    }

    const user = this.users.get(userId);

    if (!user) {
      return Result.ok(null);
    }

    return Result.ok(user);
  }

  async save(user: User): Promise<Result<void>> {
    this.users.set(user.id, user);
    this.emailToIdMap.set(user.email, user.id);
    return Result.ok(undefined);
  }

  async update(id: string, user: Partial<User>): Promise<Result<void>> {
    const existingUser = this.users.get(id);

    if (!existingUser) {
      return Result.fail(new Error('User not found'));
    }
    console.log(`updating user: ${user}`);
    // For mock purposes, we'll allow updating with the partial data
    // In a real implementation, we would need to properly update the entity
    return Result.ok(undefined);
  }

  async delete(id: string): Promise<Result<void>> {
    const user = this.users.get(id);

    if (!user) {
      return Result.fail(new Error('User not found'));
    }

    this.users.delete(id);
    this.emailToIdMap.delete(user.email);

    return Result.ok(undefined);
  }

  async exists(id: string): Promise<Result<boolean>> {
    return Result.ok(this.users.has(id));
  }
}

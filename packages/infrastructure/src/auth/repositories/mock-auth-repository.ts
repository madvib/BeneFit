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

  constructor() {
    // Initialize with mock data synchronously
    this.loadMockUsers();
  }

  private loadMockUsers() {
    // For testing purposes, we'll define the mock data directly instead of importing JSON
    // since dynamic imports of JSON can cause issues in test environments
    const userData = [
      {
        id: "user-1",
        email: "john.doe@example.com",
        name: "John Doe",
        isActive: true,
        createdAt: "2023-01-15T10:30:00.000Z"
      },
      {
        id: "user-2", 
        email: "jane.smith@example.com",
        name: "Jane Smith",
        isActive: true,
        createdAt: "2023-02-20T14:45:00.000Z"
      },
      {
        id: "user-3",
        email: "mike.johnson@example.com", 
        name: "Mike Johnson",
        isActive: true,
        createdAt: "2023-03-10T09:15:00.000Z"
      }
    ];

    userData.forEach(user => {
      const userResult = User.create({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      if (userResult.isSuccess) {
        this.users.set(userResult.value.id, userResult.value);
        this.emailToIdMap.set(userResult.value.email, userResult.value.id);
      }
    });
  }



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
    console.log('input:', JSON.stringify(input));
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
      console.log('updating user:', user);
      // For mock purposes, we return success regardless of whether user exists
      // This follows the pattern of the mock implementation
      return Result.ok(undefined);
    }

    console.log('updating user:', user);
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

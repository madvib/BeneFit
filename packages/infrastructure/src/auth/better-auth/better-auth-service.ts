import {
  LoginInput,
  LoginOutput,
  SignupInput,
  ResetPasswordInput,
  IAuthService,
  UserNotFoundError,
  AuthError,
  WeakPasswordError,
  UserNotConfirmedError,
  EmailExistsError,
  SessionExpiredError,
  InvalidCredentialsError,
  NetworkError,
} from '@bene/application/auth';
import { Result } from '@bene/core/shared';

import { createBetterAuth } from './auth.js';
import { APIError, Auth } from 'better-auth';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { RequestContext } from '@bene/application/auth/ports/auth.service.js';
import { User } from '@bene/core/index.js';
import { mapToDomainUser } from '../data/mappers/auth-mappers.js';

export class BetterAuthService implements IAuthService {
  private auth: Auth;
  constructor(db: DrizzleD1Database) {
    this.auth = createBetterAuth(db);
  }
  async getCurrentUser(input: RequestContext): Promise<Result<User>> {
    try {
      // Use the better-auth API directly
      const response = await this.auth.api.getSession({
        headers: input.headers,
      });

      if (!response) {
        return Result.fail(new Error('Get Current User Failed'));
      }

      return Result.ok(mapToDomainUser(response.user));
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }
  async getSession(input: RequestContext): Promise<Result<boolean>> {
    try {
      // Use the better-auth API directly
      const response = await this.auth.api.getSession({
        headers: input.headers,
      });

      if (!response) {
        return Result.fail(new Error('Get Session Failed'));
      }

      return Result.ok(true);
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }
  async login(input: LoginInput): Promise<Result<LoginOutput>> {
    try {
      // Use the better-auth API directly
      const response = await this.auth.api.signInEmail({
        body: {
          email: input.email.value,
          password: input.password,
        },
      });

      if (!response) {
        return Result.fail(new Error('Login failed'));
      }

      // Return LoginOutput as expected by the interface
      const loginOutput: LoginOutput = {
        userId: response.user.id,
        email: response.user.email,
      };

      return Result.ok(loginOutput);
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }

  async signup(input: SignupInput): Promise<Result<void>> {
    try {
      const response = await this.auth.api.signUpEmail({
        body: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });

      if (!response) {
        return Result.fail(new Error('Signup failed'));
      }

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }

  async resetPassword(input: ResetPasswordInput): Promise<Result<void>> {
    try {
      // Use the correct API method for password reset
      await this.auth.api.forgetPassword({
        body: {
          email: input.email,
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }

  async signOut(input: RequestContext): Promise<Result<void>> {
    try {
      // Sign out the current user
      await this.auth.api.signOut({
        headers: input.headers,
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(this.mapToApplicationError(error));
    }
  }

  private mapToApplicationError(e: unknown): AuthError {
    if (!(e instanceof APIError)) {
      console.error(e);
      return new AuthError('Something Unexpected Happened');
    } else
      switch (e.body?.message) {
        case this.auth.$ERROR_CODES.PASSWORD_TOO_LONG:
        case this.auth.$ERROR_CODES.PASSWORD_TOO_SHORT:
          return new WeakPasswordError();
        case this.auth.$ERROR_CODES.ACCOUNT_NOT_FOUND:
        case this.auth.$ERROR_CODES.USER_NOT_FOUND:
        case this.auth.$ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND:
        case this.auth.$ERROR_CODES.USER_EMAIL_NOT_FOUND:
          return new UserNotFoundError();
        case this.auth.$ERROR_CODES.EMAIL_NOT_VERIFIED:
          return new UserNotConfirmedError();
        case this.auth.$ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        case this.auth.$ERROR_CODES.USER_ALREADY_EXISTS:
        case this.auth.$ERROR_CODES.USER_ALREADY_HAS_PASSWORD:
          return new EmailExistsError();
        case this.auth.$ERROR_CODES.SESSION_EXPIRED:
          return new SessionExpiredError();
        case this.auth.$ERROR_CODES.INVALID_EMAIL:
        case this.auth.$ERROR_CODES.INVALID_EMAIL_OR_PASSWORD:
        case this.auth.$ERROR_CODES.INVALID_PASSWORD:
          return new InvalidCredentialsError();
        case this.auth.$ERROR_CODES.FAILED_TO_CREATE_SESSION:
        case this.auth.$ERROR_CODES.FAILED_TO_CREATE_USER:
        case this.auth.$ERROR_CODES.FAILED_TO_GET_SESSION:
        case this.auth.$ERROR_CODES.FAILED_TO_GET_USER_INFO:
        case this.auth.$ERROR_CODES.FAILED_TO_UNLINK_LAST_ACCOUNT:
        case this.auth.$ERROR_CODES.FAILED_TO_UPDATE_USER:
          return new NetworkError();
        case this.auth.$ERROR_CODES.ID_TOKEN_NOT_SUPPORTED:
        case this.auth.$ERROR_CODES.EMAIL_CAN_NOT_BE_UPDATED:
        case this.auth.$ERROR_CODES.INVALID_TOKEN:
        case this.auth.$ERROR_CODES.PROVIDER_NOT_FOUND:
        case this.auth.$ERROR_CODES.SOCIAL_ACCOUNT_ALREADY_LINKED:
        default:
          return new AuthError(e.body?.message ?? 'Something went wrong');
      }
  }
}

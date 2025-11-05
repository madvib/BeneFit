import { Result, Repository } from '@bene/core/shared';
import { User } from '@bene/core/auth';
import { LoginInput, LoginOutput } from '../use-cases/login/login.use-case.js';
import { SignupInput, SignupOutput } from '../use-cases/signup/signup.use-case.js';
import { ResetPasswordInput } from '../use-cases/reset-password/reset-password.use-case.js';

/**
 * Repository interface for Auth
 */
export interface IAuthRepository extends Repository<User> {
  login(input: LoginInput): Promise<Result<LoginOutput>>;
  signup(input: SignupInput): Promise<Result<SignupOutput>>;
  resetPassword(input: ResetPasswordInput): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  findById(id: string): Promise<Result<User>>;
  findByEmail(email: string): Promise<Result<User | null>>;
  save(user: User): Promise<Result<void>>;
  update(id: string, user: Partial<User>): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
  exists(id: string): Promise<Result<boolean>>;
}

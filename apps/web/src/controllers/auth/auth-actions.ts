'use server';

import { authUseCases } from '@/providers/auth-use-cases';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Define the return types for auth operations
export interface LoginInput {
  email: string;
  password: string;
  next?: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
}

export async function loginAction(input: LoginInput): Promise<LoginResult> {
  try {
    const result = await authUseCases.loginUseCase.execute({
      email: input.email,
      password: input.password,
    });

    if (result.isSuccess) {
      // Successful login - redirect to the next page or default
      const next = input.next || '/feed';
      redirect(next);
      
      // This line will never be reached due to redirect, but included for type safety
      return {
        success: true,
        redirectUrl: next,
      };
    } else {
      console.error('Login failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Error in login action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface SignupResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

export async function signupAction(input: SignupInput): Promise<SignupResult> {
  try {
    const result = await authUseCases.signupUseCase.execute({
      email: input.email,
      password: input.password,
    });

    if (result.isSuccess) {
      // In a real implementation, email confirmation might be required
      // For now, redirect to feed after successful signup
      redirect('/feed');
      
      // This line will never be reached due to redirect, but included for type safety
      return {
        success: true,
        requiresEmailConfirmation: false, // In real app, this could be true
      };
    } else {
      console.error('Signup failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Signup failed',
      };
    }
  } catch (error) {
    console.error('Error in signup action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export interface ResetPasswordInput {
  email: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ResetPasswordResult> {
  try {
    const result = await authUseCases.resetPasswordUseCase.execute({
      email: input.email,
    });

    if (result.isSuccess) {
      return {
        success: true,
        message: 'Password reset instructions sent to your email',
      };
    } else {
      console.error('Reset password failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Password reset failed',
      };
    }
  } catch (error) {
    console.error('Error in reset password action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

export interface SignOutResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function signOutAction(): Promise<SignOutResult> {
  try {
    const result = await authUseCases.signOutUseCase.execute();

    if (result.isSuccess) {
      // Clear any cached data and redirect to home
      revalidatePath('/', 'layout');
      redirect('/');
      
      // This line will never be reached due to redirect, but included for type safety
      return {
        success: true,
      };
    } else {
      console.error('Sign out failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Sign out failed',
      };
    }
  } catch (error) {
    console.error('Error in sign out action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
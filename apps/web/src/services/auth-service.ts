// This file will contain authentication-related business logic

import { createClient } from "@/infrastructure/supabase/server";
import { authLogger } from "@/shared/debug";
import {
  AuthError,
  InvalidCredentialsError,
  UserNotFoundError,
  UserNotConfirmedError,
  TooManyAttemptsError,
  WeakPasswordError,
  EmailExistsError,
  NetworkError,
  RateLimitError,
} from "@/shared/errors";
import { isValidEmail } from "@/shared/validators";

export interface LoginInput {
  email: string;
  password: string;
  next?: string;
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  email: string;
}

export interface LoginResult {
  userId: string;
  email: string;
}

export interface SignupResult {
  userId: string;
  email: string;
  requiresEmailConfirmation: boolean;
}

// Login use case
export async function login(input: LoginInput): Promise<LoginResult> {
  const supabase = await createClient();

  const { email, password } = input;

  authLogger.log("Attempting login for email:", email);

  // Validation
  if (!email || !password) {
    throw new AuthError("Email and password are required");
  }

  if (!isValidEmail(email)) {
    throw new AuthError("Please enter a valid email address");
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    authLogger.error("Login error details:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });

    // Handle specific error codes
    switch (error.code) {
      case "invalid_credentials": {
        throw new InvalidCredentialsError();
      }
      case "user_not_found": {
        throw new UserNotFoundError();
      }
      case "user_not_confirmed": {
        throw new UserNotConfirmedError();
      }
      case "too_many_attempts": {
        throw new TooManyAttemptsError();
      }
      case "network_error": {
        throw new NetworkError();
      }
      case "rate_limit_exceeded": {
        throw new RateLimitError();
      }
      default: {
        throw new AuthError(`Login failed: ${error.message}`);
      }
    }
  }

  authLogger.log("Login successful, user ID:", authData.user?.id);

  return {
    userId: authData.user?.id,
    email: authData.user?.email,
  };
}

// Signup use case
export async function signup(input: SignupInput): Promise<SignupResult> {
  const supabase = await createClient();

  const { email, password } = input;

  authLogger.log("Attempting signup for email:", email);

  // Validation
  if (!email || !password) {
    throw new AuthError("Email and password are required");
  }

  if (!isValidEmail(email)) {
    throw new AuthError("Please enter a valid email address");
  }

  if (password.length < 6) {
    throw new AuthError("Password must be at least 6 characters");
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    authLogger.error("Signup error details:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });

    // Handle specific error codes
    switch (error.code) {
      case "user_already_exists": {
        throw new EmailExistsError();
      }
      case "weak_password": {
        throw new WeakPasswordError();
      }
      case "invalid_email": {
        throw new AuthError("Please enter a valid email address");
      }
      case "network_error": {
        throw new NetworkError();
      }
      case "rate_limit_exceeded": {
        throw new RateLimitError();
      }
      default: {
        throw new AuthError(`Signup failed: ${error.message}`);
      }
    }
  }

  authLogger.log("Signup successful, user ID:", authData.user?.id);
  authLogger.info(
    "User created with confirmation status:",
    authData.user?.email_confirmed_at ? "confirmed" : "not confirmed"
  );

  return {
    userId: authData.user?.id,
    email: authData.user?.email,
    requiresEmailConfirmation: !authData.user?.email_confirmed_at,
  };
}

// Password reset use case
export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const supabase = await createClient();

  const { email } = input;

  authLogger.log("Attempting password reset for email:", email);

  // Validation
  if (!email) {
    throw new AuthError("Email is required");
  }

  if (!isValidEmail(email)) {
    throw new AuthError("Please enter a valid email address");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/update-password`,
  });

  if (error) {
    authLogger.error("Password reset error details:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });

    // Handle specific error codes
    const errorMessage = error.code === "invalid_email" 
      ? "Please enter a valid email address"
      : `Password reset failed: ${error.message}`;
    throw new AuthError(errorMessage);
  }

  authLogger.log("Password reset email sent successfully for email:", email);
}

// Sign out use case
export async function signOut(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    authLogger.error("Sign out error details:", {
      code: error.code,
      message: error.message,
      status: error.status,
    });
    // Continue with redirect even if there's an error
  }

  authLogger.log("User signed out successfully");
}

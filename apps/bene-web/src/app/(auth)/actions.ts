'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { authLogger } from '@/utils/debug'
import { 
  AuthError, 
  InvalidCredentialsError, 
  UserNotFoundError, 
  UserNotConfirmedError, 
  TooManyAttemptsError 
} from '@/lib/errors'
import { isValidEmail } from '@/utils/validators'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  authLogger.log('Attempting login for email:', email)

  // Validation
  if (!email || !password) {
      throw new AuthError('Email and password are required');
  }

  if (!isValidEmail(email)) {
    throw new AuthError('Please enter a valid email address');
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    authLogger.error('Login error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    
    // Handle specific error codes
    switch (error.code) {
      case 'invalid_credentials':
        throw new InvalidCredentialsError();
      case 'user_not_found':
        throw new UserNotFoundError();
      case 'user_not_confirmed':
        throw new UserNotConfirmedError();
      case 'too_many_attempts':
        throw new TooManyAttemptsError();
      default:
        throw new AuthError(`Login failed: ${error.message}`);
    }
  }

  authLogger.log('Login successful, user ID:', authData.user?.id);

  revalidatePath('/', 'layout')
  redirect('/feed')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  authLogger.log('Attempting signup for email:', email)

  // Validation
  if (!email || !password) {
      throw new AuthError('Email and password are required');
  }

  if (!isValidEmail(email)) {
    throw new AuthError('Please enter a valid email address');
  }

  if (password.length < 6) {
    throw new AuthError('Password must be at least 6 characters');
  }

  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    authLogger.error('Signup error details:', {
      code: error.code,
      message: error.message,
      status: error.status
    });
    
    // Handle specific error codes
    switch (error.code) {
      case 'user_already_exists':
        throw new AuthError('An account with this email already exists');
      default:
        throw new AuthError(`Signup failed: ${error.message}`);
    }
  }

  authLogger.log('Signup successful, user ID:', authData.user?.id);
  authLogger.info('User created with confirmation status:', authData.user?.email_confirmed_at ? 'confirmed' : 'not confirmed');

  revalidatePath('/', 'layout')
  redirect('/feed')
}

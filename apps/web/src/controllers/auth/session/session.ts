'use server';
import { authUseCases } from '@/providers/auth-use-cases';
import { getRequestContext } from '../get-request-context';
import { NextRequest } from 'next/server';

export interface CurrentUserResult {
  success: boolean;
  data?: {
    id: string;
    email: string;
  };
  error?: string;
}

interface SessionData {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  isAuthenticated: boolean;
}

export interface SessionResult {
  success: boolean;
  data?: SessionData;
  error?: string;
}

export async function getCurrentUser(): Promise<CurrentUserResult> {
  const requestContext = await getRequestContext();

  // Execute the GetCurrentUserUseCase to get user from session
  const result = await authUseCases
    .getCurrentUserUseCase()
    .then((uc) => uc.execute(requestContext));

  if (result.isSuccess) {
    const user = result.value;
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  } else {
    return {
      success: false,
      error: result.error?.message || 'Failed to get current user from session',
    };
  }
}

export async function getSession(request?: NextRequest): Promise<SessionResult> {
  // Get request context from the current request
  const requestContext = request
    ? { headers: request.headers, cookies: request.cookies.getAll() }
    : await getRequestContext();
  // Execute the GetCurrentSessionUseCase to get session state
  const result = await authUseCases
    .getCurrentSessionUseCase()
    .then((uc) => uc.execute(requestContext));

  if (result.isSuccess) {
    const session = result.value;
    return {
      success: true,
      data: {
        user: session.user
          ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
            }
          : null,
        isAuthenticated: session.isAuthenticated,
      },
    };
  } else {
    return {
      success: false,
      error: result.error?.message || 'Failed to get session',
    };
  }
}

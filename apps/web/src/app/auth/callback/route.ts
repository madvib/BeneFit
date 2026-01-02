import { type NextRequest, NextResponse } from 'next/server';

/**
 * Auth Callback Route
 * 
 * Handles Better Auth callbacks for:
 * - Email verification
 * - Password reset
 * - OAuth authentication
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/user/activites';

  console.log('[Auth Callback] Type:', type, 'Token:', token ? 'present' : 'missing');

  // Handle different callback types
  if (type === 'email-verification' || type === 'signup') {
    // Redirect to email confirmation page with token
    return NextResponse.redirect(
      new URL(`/email-confirmed?token=${ token }`, request.url)
    );
  }

  if (type === 'password-reset' || type === 'recovery') {
    // Redirect to update password page with token
    return NextResponse.redirect(
      new URL(`/update-password?token=${ token }`, request.url)
    );
  }

  // OAuth or other callbacks - redirect to next URL
  return NextResponse.redirect(new URL(next, request.url));
}

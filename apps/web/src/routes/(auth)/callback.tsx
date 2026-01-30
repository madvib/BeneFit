import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/lib/components';
import { MODALS } from '@/lib/constants';

const callbackSearchSchema = z.object({
  token: z.string().optional(),
  type: z.string().optional(),
  next: z.string().optional(),
});

export const Route = createFileRoute('/(auth)/callback')({
  validateSearch: (search) => callbackSearchSchema.parse(search),
  component: CallbackPage,
});

/**
 * Auth Callback Route
 *
 * Handles Better Auth callbacks for:
 * - Email verification
 * - Password reset
 * - OAuth authentication (via 'next')
 */
function CallbackPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const { token, type, next = '/user/activities' } = search;
    console.log('[Auth Callback] Type:', type, 'Token:', token ? 'present' : 'missing');

    if (type === 'email-verification' || type === 'signup') {
      navigate({
        to: '/',
        search: {
          m: MODALS.VERIFY_EMAIL,
          token: token || undefined,
        },
      });
      return;
    }

    if (type === 'password-reset' || type === 'recovery') {
      navigate({
        to: '/',
        search: { m: MODALS.UPDATE_PASSWORD, token: token || undefined },
      });
      return;
    }

    // OAuth or other callbacks - redirect to next URL
    // Since 'next' might be a full URL if coming from external OAuth, we need to handle it.
    // However, Tanstack Router usually handles internal paths.
    // If it's a relative path, use navigate.
    // If it's absolute, use window.location.

    if (next.startsWith('http')) {
      window.location.href = next;
    } else {
      navigate({ to: next });
    }
  }, [search, navigate]);

  return <LoadingSpinner variant="screen" text="Processsing..." />;
}

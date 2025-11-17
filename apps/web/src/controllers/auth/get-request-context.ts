import { RequestContext } from '@bene/application/auth';
import { cookies, headers } from 'next/headers';

// Helper function to get headers from the environment (Next.js context)
export async function getRequestContext(): Promise<RequestContext> {
  // In a Next.js environment, we need to get the headers from the request context
  // For the server-side (RSC) context, we can get headers using next/headers
  return await {
    headers: await headers(),
    cookies: (await cookies()).getAll(),
  };
}

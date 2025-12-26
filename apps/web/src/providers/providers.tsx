'use client';

import { initAuthClient, client } from '@bene/react-api-client';
import { QueryProvider } from './query-provider';

// Initialize both clients
const apiBaseUrl = process.env.NEXT_PUBLIC_GATEWAY_URL!;
initAuthClient(apiBaseUrl);

export function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

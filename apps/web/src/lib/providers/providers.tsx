'use client';

import { QueryProvider } from './query-provider';
import { UIProvider } from './ui-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UIProvider>{children}</UIProvider>
    </QueryProvider>
  );
}

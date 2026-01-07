import { useSyncExternalStore } from 'react';

export function useHydrated() {
  return useSyncExternalStore(
    () => () => { }, // subscribe: no-op (never changes after mount)
    () => true,      // client: always true
    () => false      // server: always false
  );
}

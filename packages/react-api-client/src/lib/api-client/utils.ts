import type { ApiSuccessResponse } from './types';

export async function fetchApi<TRoute extends (...args: any[]) => any>(
  route: TRoute,
  ...args: Parameters<TRoute>
): Promise<ApiSuccessResponse<TRoute>> {
  const res = await route(...args);

  if (!res.ok) {
    throw new Error('API request failed');
  }

  const data = await res.json();

  if (typeof data === 'string' || (typeof data === 'object' && data && 'error' in data)) {
    throw new Error(typeof data === 'string' ? data : data.error);
  }

  return data;
}

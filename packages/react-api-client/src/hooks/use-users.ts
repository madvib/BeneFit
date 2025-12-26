import { useQuery } from '@tanstack/react-query';
import { client } from '../client';
import { fetchApi, type ApiSuccessResponse } from '../lib/api-client';

const $getProfile = client.api.profile.$get;
export type GetProfileResponse = ApiSuccessResponse<typeof $getProfile>;

export function useProfile() {
  return useQuery<GetProfileResponse>({
    queryKey: ['profile'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi($getProfile),
  });
}

// Placeholder for other functions - need to verify actual routes in gateway
// These routes may not exist as user-specific routes in the current gateway
// The gateway appears to use general routes like /api/workouts, /api/profile, etc.
// rather than /api/users/:userId/...

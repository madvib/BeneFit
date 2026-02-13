import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { getApiClient } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
  stats: (userId: string) => [...profileKeys.all, userId, 'stats'] as const,
} as const;

// Based on actual routes from gateway/src/routes/profile.ts
// Routes: GET /, POST /, POST /goals, POST /preferences, GET /stats, POST /constraints

// Lazy getters for API endpoints - only called when hooks are used
const get$getProfile = () => getApiClient().api.profile.$get;
export type GetProfileResponse = ApiSuccessResponse<ReturnType<typeof get$getProfile>>;

export function useProfile() {
  return useQuery<GetProfileResponse>({
    queryKey: ['profile'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi(get$getProfile()),
  });
}

const get$createProfile = () => getApiClient().api.profile.$post;
export type CreateProfileRequest = InferRequestType<ReturnType<typeof get$createProfile>>;

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProfileRequest) => fetchApi(get$createProfile(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const get$updateGoals = () => getApiClient().api.profile.goals.$patch;
export type UpdateGoalsRequest = InferRequestType<ReturnType<typeof get$updateGoals>>;

export function useUpdateGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateGoalsRequest) => fetchApi(get$updateGoals(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const get$updatePreferences = () => getApiClient().api.profile.preferences.$patch;
export type UpdatePreferencesRequest = InferRequestType<ReturnType<typeof get$updatePreferences>>;

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdatePreferencesRequest) => fetchApi(get$updatePreferences(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const get$getUserStats = () => getApiClient().api.profile.stats.$get;
export type GetUserStatsResponse = ApiSuccessResponse<ReturnType<typeof get$getUserStats>>;

export function useUserStats() {
  return useQuery<GetUserStatsResponse>({
    queryKey: ['profile', 'stats'],
    queryFn: () => fetchApi(get$getUserStats()),
  });
}

const get$updateConstraints = () => getApiClient().api.profile.constraints.$patch;
export type UpdateConstraintsRequest = InferRequestType<ReturnType<typeof get$updateConstraints>>;

export function useUpdateConstraints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateConstraintsRequest) => fetchApi(get$updateConstraints(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../client';
import { fetchApi, type ApiSuccessResponse } from '../lib/api-client';

// Query keys factory
export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
  stats: (userId: string) => [...profileKeys.all, userId, 'stats'] as const,
} as const;

// Based on actual routes from gateway/src/routes/profile.ts
// Routes: GET /, POST /, POST /goals, POST /preferences, GET /stats, POST /contraints

const $getProfile = client.api.profile.$get;
export type GetProfileResponse = ApiSuccessResponse<typeof $getProfile>;

export function useProfile() {
  return useQuery<GetProfileResponse>({
    queryKey: ['profile'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi($getProfile),
  });
}

const $createProfile = client.api.profile.$post;
export type CreateProfileRequest = InferRequestType<typeof $createProfile>;

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProfileRequest) => fetchApi($createProfile, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      // The auth context provides the user in middleware
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const $updateGoals = client.api.profile.goals.$post;
export type UpdateGoalsRequest = InferRequestType<typeof $updateGoals>;

export function useUpdateGoals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateGoalsRequest) => fetchApi($updateGoals, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const $updatePreferences = client.api.profile.preferences.$post;
export type UpdatePreferencesRequest = InferRequestType<typeof $updatePreferences>;

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdatePreferencesRequest) => fetchApi($updatePreferences, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

const $getUserStats = client.api.profile.stats.$get;
export type GetUserStatsResponse = ApiSuccessResponse<typeof $getUserStats>;

export function useUserStats() {
  return useQuery<GetUserStatsResponse>({
    queryKey: ['profile', 'stats'], // No userId needed since it's injected from auth
    queryFn: () => fetchApi($getUserStats),
  });
}

const $updateConstraints = client.api.profile.contraints.$post; // Note: Gateway has typo in route name - should be constraints but is contraints
export type UpdateConstraintsRequest = InferRequestType<typeof $updateConstraints>;

export function useUpdateConstraints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateConstraintsRequest) => fetchApi($updateConstraints, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
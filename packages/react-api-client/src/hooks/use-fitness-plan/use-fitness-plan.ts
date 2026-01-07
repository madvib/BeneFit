import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const fitnessPlanKeys = {
  all: ['fitness-plan'] as const,
  active: () => [...fitnessPlanKeys.all, 'active'] as const,
  history: (userId: string) => [...fitnessPlanKeys.all, userId, 'history'] as const,
} as const;

// Based on actual routes from gateway/src/routes/fitness-plan.ts
// Routes: GET /active, POST /generate, POST /activate, POST /adjust, POST /pause

const $getActivePlan = client.api['fitness-plan'].active.$get;
export type GetActivePlanResponse = ApiSuccessResponse<typeof $getActivePlan>;

export function useActivePlan() {
  return useQuery<GetActivePlanResponse>({
    queryKey: fitnessPlanKeys.active(),
    queryFn: () => fetchApi($getActivePlan),
  });
}

const $generatePlan = client.api['fitness-plan'].generate.$post;
export type GeneratePlanRequest = InferRequestType<typeof $generatePlan>;
export type GeneratePlanResponse = ApiSuccessResponse<typeof $generatePlan>;

export function useGeneratePlan() {
  return useMutation({
    mutationFn: (request: GeneratePlanRequest) => fetchApi($generatePlan, request),
    onSuccess: () => {
    },
  });
}

const $activatePlan = client.api['fitness-plan'].activate.$post;
export type ActivatePlanRequest = InferRequestType<typeof $activatePlan>;

export function useActivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ActivatePlanRequest) => fetchApi($activatePlan, request),
    onSuccess: () => {
      // Invalidate active plan query to refetch
      queryClient.invalidateQueries({ queryKey: fitnessPlanKeys.active() });
    },
  });
}

const $adjustPlan = client.api['fitness-plan'].adjust.$post;
export type AdjustPlanRequest = InferRequestType<typeof $adjustPlan>;

export function useAdjustPlan() {
  return useMutation({
    mutationFn: (request: AdjustPlanRequest) => fetchApi($adjustPlan, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
    },
  });
}

const $pausePlan = client.api['fitness-plan'].pause.$post;
export type PausePlanRequest = InferRequestType<typeof $pausePlan>;

export function usePausePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PausePlanRequest) => fetchApi($pausePlan, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fitnessPlanKeys.active() });
    },
  });
}

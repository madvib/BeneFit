import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { getApiClient } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const fitnessPlanKeys = {
  all: ['fitness-plan'] as const,
  active: () => [...fitnessPlanKeys.all, 'active'] as const,
  history: (userId: string) => [...fitnessPlanKeys.all, userId, 'history'] as const,
} as const;

// Based on actual routes from gateway/src/routes/fitness-plan.ts
// Routes: GET /active, POST /generate, POST /activate, POST /adjust, POST /pause

// Lazy getters for API endpoints - only called when hooks are used
const get$getActivePlan = () => getApiClient().api['fitness-plan'].active.$get;
export type GetActivePlanResponse = ApiSuccessResponse<ReturnType<typeof get$getActivePlan>>;

export function useActivePlan() {
  return useQuery<GetActivePlanResponse>({
    queryKey: fitnessPlanKeys.active(),
    queryFn: () => fetchApi(get$getActivePlan()),
  });
}

const get$generatePlan = () => getApiClient().api['fitness-plan'].generate.$post;
export type GeneratePlanRequest = InferRequestType<ReturnType<typeof get$generatePlan>>;
export type GeneratePlanResponse = ApiSuccessResponse<ReturnType<typeof get$generatePlan>>;

export function useGeneratePlan() {
  return useMutation({
    mutationFn: (request: GeneratePlanRequest) => fetchApi(get$generatePlan(), request),
    onSuccess: () => {},
  });
}

const get$activatePlan = () => getApiClient().api['fitness-plan'].activate.$post;
export type ActivatePlanRequest = InferRequestType<ReturnType<typeof get$activatePlan>>;

export function useActivatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ActivatePlanRequest) => fetchApi(get$activatePlan(), request),
    onSuccess: () => {
      // Invalidate active plan query to refetch
      queryClient.invalidateQueries({ queryKey: fitnessPlanKeys.active() });
    },
  });
}

const get$adjustPlan = () => getApiClient().api['fitness-plan'].adjust.$post;
export type AdjustPlanRequest = InferRequestType<ReturnType<typeof get$adjustPlan>>;

export function useAdjustPlan() {
  return useMutation({
    mutationFn: (request: AdjustPlanRequest) => fetchApi(get$adjustPlan(), request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
    },
  });
}

const get$pausePlan = () => getApiClient().api['fitness-plan'].pause.$post;
export type PausePlanRequest = InferRequestType<ReturnType<typeof get$pausePlan>>;

export function usePausePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PausePlanRequest) => fetchApi(get$pausePlan(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fitnessPlanKeys.active() });
    },
  });
}

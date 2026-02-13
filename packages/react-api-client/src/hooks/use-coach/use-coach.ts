import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { getApiClient } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const coachKeys = {
  all: ['coach'] as const,
  summary: (userId: string) => [...coachKeys.all, userId, 'summary'] as const,
  checkIn: (userId: string) => [...coachKeys.all, userId, 'check-in'] as const,
  history: () => [...coachKeys.all, 'history'] as const,
} as const;

// Based on actual routes from gateway/src/routes/coach.ts
// Routes: POST /message, POST /summary, GET /history, POST /check-in/dismiss, POST /check-in/respond, POST /check-in/trigger

// Lazy getters for API endpoints - only called when hooks are used
const get$getHistory = () => getApiClient().api.coach.history.$get;
export type GetCoachHistoryResponse = ApiSuccessResponse<ReturnType<typeof get$getHistory>>;

export function useCoachHistory() {
  return useQuery<GetCoachHistoryResponse>({
    queryKey: coachKeys.history(),
    queryFn: () => fetchApi(get$getHistory()),
  });
}

const get$sendMessage = () => getApiClient().api.coach.message.$post;
export type SendMessageRequest = InferRequestType<ReturnType<typeof get$sendMessage>>;

export function useSendMessage() {
  return useMutation({
    mutationFn: (request: SendMessageRequest) => fetchApi(get$sendMessage(), request),
  });
}

const get$dismissCheckIn = () => getApiClient().api.coach['check-in'].dismiss.$post;
export type DismissCheckInRequest = InferRequestType<ReturnType<typeof get$dismissCheckIn>>;

export function useDismissCheckIn() {
  return useMutation({
    mutationFn: (request: DismissCheckInRequest) => fetchApi(get$dismissCheckIn(), request),
    onSuccess: () => {},
  });
}

const get$respondToCheckIn = () => getApiClient().api.coach['check-in'].respond.$post;
export type RespondToCheckInRequest = InferRequestType<ReturnType<typeof get$respondToCheckIn>>;

export function useRespondToCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RespondToCheckInRequest) => fetchApi(get$respondToCheckIn(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.history() });
      queryClient.invalidateQueries({ queryKey: ['fitness-plan', 'active'] }); // Invalidate plan in case of adjustments
    },
  });
}

const get$triggerProactiveCheckIn = () => getApiClient().api.coach['check-in'].trigger.$post;
export type TriggerProactiveCheckInRequest = InferRequestType<
  ReturnType<typeof get$triggerProactiveCheckIn>
>;

export function useTriggerProactiveCheckIn() {
  return useMutation({
    mutationFn: (request: TriggerProactiveCheckInRequest) =>
      fetchApi(get$triggerProactiveCheckIn(), request),
  });
}

const get$generateWeeklySummary = () => getApiClient().api.coach.summary.$post;
export type GenerateWeeklySummaryRequest = InferRequestType<
  ReturnType<typeof get$generateWeeklySummary>
>;

export function useGenerateWeeklySummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GenerateWeeklySummaryRequest) =>
      fetchApi(get$generateWeeklySummary(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.history() });
    },
  });
}

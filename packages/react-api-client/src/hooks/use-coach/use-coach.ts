import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../../client';
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

const $getHistory = client.api.coach.history.$get;
export type GetCoachHistoryResponse = ApiSuccessResponse<typeof $getHistory>;

export function useCoachHistory() {
  return useQuery<GetCoachHistoryResponse>({
    queryKey: coachKeys.history(),
    queryFn: () => fetchApi($getHistory),
  });
}

const $sendMessage = client.api.coach.message.$post;
export type SendMessageRequest = InferRequestType<typeof $sendMessage>;

export function useSendMessage() {
  return useMutation({
    mutationFn: (request: SendMessageRequest) => fetchApi($sendMessage, request),
  });
}

const $dismissCheckIn = client.api.coach['check-in'].dismiss.$post;
export type DismissCheckInRequest = InferRequestType<typeof $dismissCheckIn>;

export function useDismissCheckIn() {
  return useMutation({
    mutationFn: (request: DismissCheckInRequest) => fetchApi($dismissCheckIn, request),
    onSuccess: () => {
    },
  });
}

const $respondToCheckIn = client.api.coach['check-in'].respond.$post;
export type RespondToCheckInRequest = InferRequestType<typeof $respondToCheckIn>;

export function useRespondToCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RespondToCheckInRequest) => fetchApi($respondToCheckIn, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.history() });
      queryClient.invalidateQueries({ queryKey: ['fitness-plan', 'active'] }); // Invalidate plan in case of adjustments
    },
  });
}

const $triggerProactiveCheckIn = client.api.coach['check-in'].trigger.$post;
export type TriggerProactiveCheckInRequest = InferRequestType<
  typeof $triggerProactiveCheckIn
>;

export function useTriggerProactiveCheckIn() {
  return useMutation({
    mutationFn: (request: TriggerProactiveCheckInRequest) => fetchApi($triggerProactiveCheckIn, request),
  });
}

const $generateWeeklySummary = client.api.coach.summary.$post;
export type GenerateWeeklySummaryRequest = InferRequestType<
  typeof $generateWeeklySummary
>;

export function useGenerateWeeklySummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GenerateWeeklySummaryRequest) => fetchApi($generateWeeklySummary, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.history() });
    },
  });
}

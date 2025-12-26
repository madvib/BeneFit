import { useMutation } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../client';
import { fetchApi } from '../lib/api-client';

// Query keys factory
export const coachKeys = {
  all: ['coach'] as const,
  summary: (userId: string) => [...coachKeys.all, userId, 'summary'] as const,
  checkIn: (userId: string) => [...coachKeys.all, userId, 'check-in'] as const,
} as const;

// Based on actual routes from gateway/src/routes/coach.ts
// Routes: POST /message, POST /summary, POST /check-in/dismiss, POST /check-in/respond, POST /check-in/trigger

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
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
      // The auth context provides the user in middleware
    },
  });
}

const $respondToCheckIn = client.api.coach['check-in'].respond.$post;
export type RespondToCheckInRequest = InferRequestType<typeof $respondToCheckIn>;

export function useRespondToCheckIn() {
  return useMutation({
    mutationFn: (request: RespondToCheckInRequest) => fetchApi($respondToCheckIn, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
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
  return useMutation({
    mutationFn: (request: GenerateWeeklySummaryRequest) => fetchApi($generateWeeklySummary, request),
    onSuccess: () => {
      // Note: userId is injected server-side, we can't retrieve it from mutation variables
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { client } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const workoutKeys = {
  all: ['workouts'] as const,
  today: () => [...workoutKeys.all, 'today'] as const,
  upcoming: () => [...workoutKeys.all, 'upcoming'] as const,
  history: () => [...workoutKeys.all, 'history'] as const,
  session: (sessionId: string) => [...workoutKeys.all, 'session', sessionId] as const,
  multiplayer: (sessionId: string) =>
    [...workoutKeys.all, 'multiplayer', sessionId] as const,
} as const;

// Based on actual routes from gateway/src/routes/workouts.ts
// Routes: GET /today, GET /upcoming, GET /history, POST /skip, POST /:sessionId/start,
//         POST /:sessionId/complete, POST /:sessionId/join, POST /:sessionId/reaction

const $getTodaysWorkout = client.api.workouts.today.$get;
export type GetTodaysWorkoutResponse = ApiSuccessResponse<typeof $getTodaysWorkout>;

export function useTodaysWorkout() {
  return useQuery<GetTodaysWorkoutResponse>({
    queryKey: workoutKeys.today(),
    queryFn: () => fetchApi($getTodaysWorkout),
  });
}

const $getUpcomingWorkouts = client.api.workouts.upcoming.$get;
export type GetUpcomingWorkoutsRequest = InferRequestType<typeof $getUpcomingWorkouts>;
export type GetUpcomingWorkoutsResponse = ApiSuccessResponse<typeof $getUpcomingWorkouts>;
export function useUpcomingWorkouts(input: GetUpcomingWorkoutsRequest) {
  return useQuery<GetUpcomingWorkoutsResponse>({
    queryKey: workoutKeys.upcoming(),
    queryFn: () => fetchApi($getUpcomingWorkouts, input),
  });
}

const $getWorkoutHistory = client.api.workouts.history.$get;
export type GetWorkoutHistoryRequest = InferRequestType<typeof $getWorkoutHistory>;
export type GetWorkoutHistoryResponse = ApiSuccessResponse<typeof $getWorkoutHistory>;
export function useWorkoutHistory(input: GetWorkoutHistoryRequest) {
  return useQuery<GetWorkoutHistoryResponse>({
    queryKey: workoutKeys.history(),
    queryFn: () => fetchApi($getWorkoutHistory, input),
  });
}

//GOOD, descriptive name, exported types for frontend application
const $skipWorkout = client.api.workouts.skip.$post;
export type SkipWorkoutRequest = InferRequestType<typeof $skipWorkout>;

export function useSkipWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SkipWorkoutRequest) => fetchApi($skipWorkout, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.today() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.upcoming() });
    },
  });
}

export const $startWorkout = client.api.workouts[':sessionId'].start.$post;
export type StartWorkoutRequest = InferRequestType<typeof $startWorkout>;
export type StartWorkoutResponse = ApiSuccessResponse<typeof $startWorkout>;

export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StartWorkoutRequest) => fetchApi($startWorkout, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.today() });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(variables.param.sessionId),
      });
    },
  });
}

const $completeWorkout = client.api.workouts[':sessionId'].complete.$post;
export type CompleteWorkoutRequest = InferRequestType<typeof $completeWorkout>;

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CompleteWorkoutRequest) => fetchApi($completeWorkout, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.today() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.history() });
      queryClient.invalidateQueries({ queryKey: ['profile'] }); // Invalidate profile stats/streaks
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(variables.json.sessionId),
      });
    },
  });
}

const $joinMultiplayerWorkout = client.api.workouts[':sessionId'].join.$post;
export type JoinMultiplayerWorkoutRequest = InferRequestType<
  typeof $joinMultiplayerWorkout
>;

export function useJoinMultiplayerWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: JoinMultiplayerWorkoutRequest) => fetchApi($joinMultiplayerWorkout, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.multiplayer(variables.json.sessionId),
      });
    },
  });
}

const $addWorkoutReaction = client.api.workouts[':sessionId'].reaction.$post;
export type AddWorkoutReactionRequest = InferRequestType<typeof $addWorkoutReaction>;

export function useAddWorkoutReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddWorkoutReactionRequest) => fetchApi($addWorkoutReaction, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(variables.param.sessionId),
      });
    },
  });
}

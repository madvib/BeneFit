import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { InferRequestType } from 'hono/client';
import { getApiClient } from '../../client';
import { fetchApi, type ApiSuccessResponse } from '../../lib/api-client';

// Query keys factory
export const workoutKeys = {
  all: ['workouts'] as const,
  today: () => [...workoutKeys.all, 'today'] as const,
  upcoming: () => [...workoutKeys.all, 'upcoming'] as const,
  history: () => [...workoutKeys.all, 'history'] as const,
  session: (sessionId: string) => [...workoutKeys.all, 'session', sessionId] as const,
  multiplayer: (sessionId: string) => [...workoutKeys.all, 'multiplayer', sessionId] as const,
} as const;

// Based on actual routes from gateway/src/routes/workouts.ts
// Routes: GET /today, GET /upcoming, GET /history, POST /skip, POST /:sessionId/start,
//         POST /:sessionId/complete, POST /:sessionId/join, POST /:sessionId/reaction

// Lazy getters for API endpoints - only called when hooks are used
const get$getTodaysWorkout = () => getApiClient().api.workouts.today.$get;
export type GetTodaysWorkoutResponse = ApiSuccessResponse<
  ReturnType<typeof get$getTodaysWorkout>
>;

export function useTodaysWorkout() {
  return useQuery<GetTodaysWorkoutResponse>({
    queryKey: workoutKeys.today(),
    queryFn: () => fetchApi(get$getTodaysWorkout()),
  });
}

const get$getUpcomingWorkouts = () => getApiClient().api.workouts.upcoming.$get;
export type GetUpcomingWorkoutsRequest = InferRequestType<
  ReturnType<typeof get$getUpcomingWorkouts>
>;
export type GetUpcomingWorkoutsResponse = ApiSuccessResponse<
  ReturnType<typeof get$getUpcomingWorkouts>
>;
export function useUpcomingWorkouts(input: GetUpcomingWorkoutsRequest) {
  return useQuery<GetUpcomingWorkoutsResponse>({
    queryKey: workoutKeys.upcoming(),
    queryFn: () => fetchApi(get$getUpcomingWorkouts(), input),
  });
}

const get$getWorkoutHistory = () => getApiClient().api.workouts.history.$get;
export type GetWorkoutHistoryRequest = InferRequestType<ReturnType<typeof get$getWorkoutHistory>>;
export type GetWorkoutHistoryResponse = ApiSuccessResponse<
  ReturnType<typeof get$getWorkoutHistory>
>;
export function useWorkoutHistory(input: GetWorkoutHistoryRequest) {
  return useQuery<GetWorkoutHistoryResponse>({
    queryKey: workoutKeys.history(),
    queryFn: () => fetchApi(get$getWorkoutHistory(), input),
  });
}

//GOOD, descriptive name, exported types for frontend application
const get$skipWorkout = () => getApiClient().api.workouts.skip.$post;
export type SkipWorkoutRequest = InferRequestType<ReturnType<typeof get$skipWorkout>>;

export function useSkipWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SkipWorkoutRequest) => fetchApi(get$skipWorkout(), request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.today() });
      queryClient.invalidateQueries({ queryKey: workoutKeys.upcoming() });
    },
  });
}

const get$startWorkout = () => getApiClient().api.workouts[':sessionId'].start.$post;
export type StartWorkoutRequest = InferRequestType<ReturnType<typeof get$startWorkout>>;
export type StartWorkoutResponse = ApiSuccessResponse<ReturnType<typeof get$startWorkout>>;

export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StartWorkoutRequest) => fetchApi(get$startWorkout(), request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workoutKeys.today() });
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(variables.param.sessionId),
      });
    },
  });
}

const get$completeWorkout = () => getApiClient().api.workouts[':sessionId'].complete.$post;
export type CompleteWorkoutRequest = InferRequestType<ReturnType<typeof get$completeWorkout>>;

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CompleteWorkoutRequest) => fetchApi(get$completeWorkout(), request),
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

const get$joinMultiplayerWorkout = () => getApiClient().api.workouts[':sessionId'].join.$post;
export type JoinMultiplayerWorkoutRequest = InferRequestType<
  ReturnType<typeof get$joinMultiplayerWorkout>
>;

export function useJoinMultiplayerWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: JoinMultiplayerWorkoutRequest) =>
      fetchApi(get$joinMultiplayerWorkout(), request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.multiplayer(variables.json.sessionId),
      });
    },
  });
}

const get$addWorkoutReaction = () => getApiClient().api.workouts[':sessionId'].reaction.$post;
export type AddWorkoutReactionRequest = InferRequestType<
  ReturnType<typeof get$addWorkoutReaction>
>;

export function useAddWorkoutReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddWorkoutReactionRequest) =>
      fetchApi(get$addWorkoutReaction(), request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.session(variables.param.sessionId),
      });
    },
  });
}

// Stub implementation until streaming is ready
// Stub implementation until streaming is ready
// import { buildWorkoutSessionResponse } from '../../fixtures/training';

export function useWorkoutSession(_sessionId: string) {
  // TODO: Replace with actual implementation (likely streaming/ws)
  // const session = buildWorkoutSessionResponse({
  //   id: sessionId,
  // });

  return {
    data: null,
    isLoading: false,
    isError: false,
  };
}

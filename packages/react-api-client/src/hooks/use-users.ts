import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userClient } from '../client';

// Type helper for RPC
type Client = typeof userClient;

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['user', userId, 'profile'],
    queryFn: async () => {
      const res = await userClient.users[':userId'].profile.$get({
        param: { userId },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return await res.json();
    },
    enabled: !!userId,
  });
}

export function usePlan(userId: string) {
  return useQuery({
    queryKey: ['user', userId, 'plan'],
    queryFn: async () => {
      const res = await userClient.users[':userId'].plan.$get({
        param: { userId },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch user plan');
      }
      return await res.json();
    },
    enabled: !!userId,
  });
}

export function useTodaysWorkout(userId: string) {
  return useQuery({
    queryKey: ['user', userId, 'workout', 'today'],
    queryFn: async () => {
      const res = await userClient.users[':userId'].workout.today.$get({
        param: { userId },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch todays workout');
      }
      return await res.json();
    },
    enabled: !!userId,
  });
}

export function useStartWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      workoutId,
    }: {
      userId: string;
      workoutId: string;
    }) => {
      const res = await userClient.users[':userId'].workout.start.$post({
        param: { userId },
        json: { workoutId },
      });
      if (!res.ok) {
        throw new Error('Failed to start workout');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId, 'workout', 'today'],
      });
    },
  });
}

export function useCompleteWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      sessionId,
      performanceData,
    }: {
      userId: string;
      sessionId: string;
      performanceData: any; // Replace with proper type if available from shared package
    }) => {
      const res = (await userClient.users[':userId'].workout.complete.$post({
        param: { userId },
        json: { sessionId, performanceData },
      })) as any; // Cast if needed due to complex types, but ideally inferred

      if (!res.ok) {
        throw new Error('Failed to complete workout');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'workout'] });
    },
  });
}

export function useGeneratePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      goals,
      constraints,
    }: {
      userId: string;
      goals: any; // Ideally typed from domain
      constraints: any;
    }) => {
      const res = await userClient.users[':userId'].plan.generate.$post({
        param: { userId },
        json: { goals, constraints },
      });
      if (!res.ok) {
        throw new Error('Failed to generate plan');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId, 'plan'] });
    },
  });
}

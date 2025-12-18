import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutClient } from '../client';

export function useTodaysWorkout(userId: string) {
  return useQuery({
    queryKey: ['workout', 'today', userId],
    queryFn: async () => {
      const res = await workoutClient.today.$get({
        query: { userId },
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
    mutationFn: async ({ userId, workoutId }: { userId: string; workoutId: string }) => {
      const res = await workoutClient.start.$post({
        json: { userId, workoutId },
      });
      if (!res.ok) {
        throw new Error('Failed to start workout');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ['workout', 'today', userId],
      });
    },
  });
}

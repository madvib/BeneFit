import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coachClient, userClient } from '../client';

// Note: Some coach actions are on userClient (via UserHub) and some on coachClient directly?
// Looking at gateway routes:
// userRoutes has: POST /users/:userId/coaching/message, GET /users/:userId/coaching/history
// coachRoutes has: POST /message, GET /history (which seem redundant or maybe direct access?)
// The coachRoutes requires userId in body/query.
// I'll implement using the coachClient for the routes explicitly defined in coach.ts

export function useHistory(userId: string) {
  return useQuery({
    queryKey: ['coach', userId, 'history'],
    queryFn: async () => {
      const res = await coachClient.history.$get({
        query: { userId },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch coach history');
      }
      return await res.json();
    },
    enabled: !!userId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const res = await coachClient.message.$post({
        json: { userId, message },
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['coach', userId, 'history'] });
    },
  });
}

export function useDismissCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, checkInId }: { userId: string, checkInId: string }) => {
      const res = await coachClient['check-in'].dismiss.$post({
        json: { userId, checkInId }
      });
      if (!res.ok) {
        throw new Error('Failed to dismiss check-in');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      // Invalidate relevant queries (maybe history or a check-in list if it existed)
      queryClient.invalidateQueries({ queryKey: ['coach', userId] });
    }
  })
}

export function useRespondToCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, checkInId, response }: { userId: string, checkInId: string, response: any }) => {
      const res = await coachClient['check-in'].respond.$post({
        json: { userId, checkInId, response }
      });
      if (!res.ok) {
        throw new Error('Failed to respond to check-in');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['coach', userId] });
    }
  })
}

export function useTriggerProactiveCheckIn() {
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await coachClient['check-in'].trigger.$post({
        json: { userId }
      });
      if (!res.ok) {
        throw new Error('Failed to trigger check-in');
      }
      return await res.json();
    }
  })
}

export function useGenerateWeeklySummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await coachClient.summary.$post({
        json: { userId }
      });
      if (!res.ok) {
        throw new Error('Failed to generate summary');
      }
      return await res.json();
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ['coach', userId] });
    }
  })
}

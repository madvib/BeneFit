'use client';

import { useRouter } from 'next/navigation';
import { useTodaysWorkout, useStartWorkout, useSkipWorkout, useProfile } from '@bene/react-api-client';
import TodayView from './_components/today-view';

export default function TodaysWorkoutPage() {
  const todaysWorkoutQuery = useTodaysWorkout();
  const profileQuery = useProfile();
  const startWorkoutMutation = useStartWorkout();
  const skipWorkoutMutation = useSkipWorkout();

  const todaysWorkoutData = todaysWorkoutQuery.data;
  // TODO: Fix type mismatch. API returns `workout` but UI expects `workoutId`.
  // Casting for now to ensure we pass the right shape if it exists.
  const todaysWorkout = todaysWorkoutData?.workout;
  const userProfile = profileQuery.data;

  const isLoading =
    todaysWorkoutQuery.isLoading ||
    profileQuery.isLoading ||
    startWorkoutMutation.isPending ||
    skipWorkoutMutation.isPending;

  const error =
    todaysWorkoutQuery.error ||
    profileQuery.error ||
    startWorkoutMutation.error ||
    skipWorkoutMutation.error;

  // Add router
  const router = useRouter();

  const handleStartWorkout = async () => {
    if (todaysWorkout?.id && userProfile) {
      await startWorkoutMutation.mutateAsync({
        param: { sessionId: todaysWorkout.id },
        json: {},
      });
      router.push(`/user/workout/${todaysWorkout.id}`);
    }
  };

  const handleSkipWorkout = async (reason: string) => {
    if (todaysWorkout?.id) {
      await skipWorkoutMutation.mutateAsync({
        json: {
          planId: todaysWorkout.planId,
          workoutId: todaysWorkout.id,
          reason,
        },
      });
      // Invalidate queries or handle UI update?
      // For now, parent might re-fetch or invalidation happens globally
    }
  };

  return (
    <TodayView
      todaysWorkout={todaysWorkout}
      isLoading={isLoading}
      error={error}
      onStartWorkout={handleStartWorkout}
      onSkipWorkout={handleSkipWorkout}
      isStarting={startWorkoutMutation.isPending}
      isSkipping={skipWorkoutMutation.isPending}
    />
  );
}

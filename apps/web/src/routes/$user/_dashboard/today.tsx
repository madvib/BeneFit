import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTodaysWorkout, useStartWorkout, useSkipWorkout, useProfile } from '@bene/react-api-client';
import TodayView from './-components/today/today-view';
import { ErrorPage, LoadingSpinner } from '@/lib/components';

export const Route = createFileRoute('/$user/_dashboard/today')({
  component: TodaysWorkoutPage,
});

function TodaysWorkoutPage() {
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
  const navigate = useNavigate();

  const handleStartWorkout = async () => {
    if (todaysWorkout?.id && userProfile) {
      await startWorkoutMutation.mutateAsync({
        param: { sessionId: todaysWorkout.id },
        json: {},
      });
      navigate({ to: `/user/session/${todaysWorkout.id}`});
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
  if (isLoading && !todaysWorkout) {
    return <LoadingSpinner variant="screen" text="Preparing your session..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Connection Issue"
        message="Unable to retrieve your training plan for today."
        error={error as Error}
      />
    );
  }

  return (
    <TodayView
      todaysWorkout={todaysWorkout}
      onStartWorkout={handleStartWorkout}
      onSkipWorkout={handleSkipWorkout}
      isSkipping={skipWorkoutMutation.isPending}
    />
  );
}

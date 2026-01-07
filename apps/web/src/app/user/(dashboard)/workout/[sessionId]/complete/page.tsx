'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import WorkoutSummary from './#components/workout-summary';
import PerformanceForm from './#components/performance-form';
import AchievementPopup from './#components/achievement-popup';
import { CheckCircle } from 'lucide-react';

export default function CompleteWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [earnedAchievements, setEarnedAchievements] = useState<
    { id: string; name: string; description: string }[]
  >([]);
  const [showAchievements, setShowAchievements] = useState(false);

  // TODO: Replace useTodaysWorkout with useWorkoutSession(sessionId) once implemented
  // See implementation_plan.md for details on adding GET /:sessionId endpoint
  const sessionQuery = workouts.useTodaysWorkout();

  const completeMutation = workouts.useCompleteWorkout();

  const handleComplete = async (
    data: import('./#components/performance-form').PerformanceFormData,
  ) => {
    const result = await completeMutation.mutateAsync({
      param: { sessionId },
      json: {
        sessionId,
        performance: {
          completedAt: new Date().toISOString(),
          durationMinutes: data.performance.durationActual,
          perceivedExertion: data.performance.rpe,
          enjoyment: Math.round(data.performance.rpe / 2), // Derive enjoyment from RPE
          activities: [], // No detailed activity tracking in this simplified form
          notes: data.performance.feedback,
        },
        verification: {
          method: 'manual' as const,
          verified: true,
          data: {
            timestamp: new Date().toISOString(),
          },
          verifiedAt: new Date().toISOString(),
        },
        shareToFeed: data.shareToFeed,
      },
    });

    if (result.achievementsEarned && result.achievementsEarned.length > 0) {
      setEarnedAchievements(result.achievementsEarned);
      setShowAchievements(true);
    } else {
      router.push(ROUTES.USER.HISTORY);
    }
  };

  const handleCloseAchievements = () => {
    setShowAchievements(false);
    router.push(ROUTES.USER.HISTORY);
  };

  if (sessionQuery.isLoading) {
    return <LoadingSpinner variant="screen" text="Loading session..." />;
  }

  if (sessionQuery.error || !sessionId) {
    return (
      <ErrorPage
        title="Session Error"
        message="Could not load workout session."
        backHref={ROUTES.USER.TODAY}
      />
    );
  }

  // Fallback if no active workout found or ID mismatch (simplified logic)
  const workout = sessionQuery.data?.workout;

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle size={32} />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Workout Complete!</h1>
        <p className="text-muted-foreground">Great job! Confirm your stats to finish up.</p>
      </div>

      <div className="grid gap-8">
        {workout && <WorkoutSummary workout={workout} />}

        <PerformanceForm
          workout={workout || {}}
          onSubmit={handleComplete}
          isLoading={completeMutation.isPending}
        />
      </div>

      <AchievementPopup
        achievements={earnedAchievements}
        isOpen={showAchievements}
        onClose={handleCloseAchievements}
      />
    </div>
  );
}

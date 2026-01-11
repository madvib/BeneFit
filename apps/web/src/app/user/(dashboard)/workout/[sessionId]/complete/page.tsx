'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, WorkoutSummary } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import PerformanceForm, { type PerformanceFormData } from './_components/performance-form';
import AchievementPopup from './_components/achievement-popup';
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
  const sessionQuery = workouts.useTodaysWorkout();
  const completeMutation = workouts.useCompleteWorkout();

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

  const workout = sessionQuery.data?.workout;

  const handleComplete = async (data: PerformanceFormData) => {
    const now = new Date().toISOString();
    const result = await completeMutation.mutateAsync({
      param: { sessionId },
      json: {
        sessionId,
        performance: {
          startedAt: new Date(
            Date.now() - data.performance.durationMinutes * 60_000,
          ).toISOString(),
          completedAt: now,
          durationMinutes: data.performance.durationMinutes,
          perceivedExertion: data.performance.perceivedExertion,
          energyLevel: 'medium',
          enjoyment: Math.round(data.performance.perceivedExertion / 2) || 1,
          difficultyRating: 'just_right',
          activities: [],
          notes: data.performance.notes,
        },
        verification: {
          verified: true,
          verifications: [{ method: 'manual', data: null }],
          sponsorEligible: false,
          verifiedAt: now,
        },
        shareToFeed: data.shareToFeed,
      },
    });

    if (result.achievementsEarned?.length) {
      setEarnedAchievements(result.achievementsEarned);
      setShowAchievements(true);
    } else {
      router.push(ROUTES.USER.HISTORY);
    }
  };

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
        {workout && (
          <>
            <WorkoutSummary workout={workout} />
            <PerformanceForm
              workout={workout}
              onSubmit={handleComplete}
              isLoading={completeMutation.isPending}
            />
          </>
        )}
      </div>

      <AchievementPopup
        achievements={earnedAchievements}
        isOpen={showAchievements}
        onClose={() => {
          setShowAchievements(false);
          router.push(ROUTES.USER.HISTORY);
        }}
      />
    </div>
  );
}

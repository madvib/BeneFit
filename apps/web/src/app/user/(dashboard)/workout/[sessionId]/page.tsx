'use client';

import { useParams, useRouter } from 'next/navigation';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import SessionView from './session-view';

export default function ActiveWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  // Using useTodaysWorkout as a proxy for active session details
  // In reality we'd want useSession(sessionId)
  const sessionQuery = workouts.useTodaysWorkout();
  const workout = sessionQuery.data?.workout;

  const handleFinish = () => {
    router.push(`/user/workout/${sessionId}/complete`);
  };

  const handleBack = () => {
    router.back();
  };

  if (sessionQuery.isLoading) return <LoadingSpinner variant="screen" />;

  if (sessionQuery.error || !workout) {
    return (
      <ErrorPage
        title="Workout Not Found"
        message="Could not load the active workout session."
        backHref={ROUTES.USER.TODAY}
      />
    );
  }

  return <SessionView workout={workout} onComplete={handleFinish} onBack={handleBack} />;
}

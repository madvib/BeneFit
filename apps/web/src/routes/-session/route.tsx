import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useWorkoutSession } from '@bene/react-api-client';
import SessionView from './session-view';

// This route is ignored by the router due to the leading '-' in the directory name.
// It serves as a placeholder for the session logic.

export default function SessionPage() {
  const router = useRouter();
  // We can't use useParams properly here since this isn't a registered route
  // In a real implementation we'd probably use a route param
  const sessionId = 'mock-session-id'; 
  const { data: session, isLoading, isError } = useWorkoutSession(sessionId);

  const handleBack = () => {
    router.history.back();
  };

  const handleComplete = (performance: {
    elapsedSeconds: number;
    activityPerformance: { reps: number; weight: number; rpe?: number }[][][];
  }) => {
    console.log('Session Performance:', performance);
    router.navigate({ to: '/user/activities' });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !session) return <div>Error loading session</div>;

  return (
    <SessionView
      session={session}
      onAbort={handleBack}
      onComplete={handleComplete}
    />
  );
}

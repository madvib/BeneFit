'use client';

import { useRouter, useParams } from 'next/navigation';
import { useWorkoutSession } from '@bene/react-api-client';
import SessionView from './session-view';

export default function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { data: session, isLoading, isError } = useWorkoutSession(sessionId);

  const handleBack = () => {
    router.back();
  };

  const handleComplete = (performance: {
    elapsedSeconds: number;
    activityPerformance: { reps: number; weight: number; rpe?: number }[][][];
  }) => {
    console.log('Session Performance:', performance);
    router.push('/user/activities');
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

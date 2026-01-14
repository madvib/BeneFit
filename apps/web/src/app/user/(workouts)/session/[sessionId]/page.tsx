'use client';

import { useRouter } from 'next/navigation';
import { mockPushIntensitySession } from '@/lib/testing/fixtures/workouts';
import SessionView from './session-view';

export default function SessionPage() {
  const router = useRouter();

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

  return (
    <SessionView
      session={mockPushIntensitySession}
      onAbort={handleBack}
      onComplete={handleComplete}
    />
  );
}

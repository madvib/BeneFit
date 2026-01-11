'use client';

import { useRouter } from 'next/navigation';
import SessionView from './session-view';
import { mockPushIntensitySession } from '@/lib/testing/fixtures/workouts';

export default function SessionPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleComplete = (performance: {
    elapsedSeconds: number;
    activityPerformance: any[][];
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

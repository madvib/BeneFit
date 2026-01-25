'use client';

import { useState } from 'react';
import { 

  SkipWorkoutModal 
} from '@/lib/components';
import { ScheduledWorkoutView, RestDayView } from '@/lib/components/fitness/workouts';
import { GetTodaysWorkoutResponse } from '@bene/react-api-client';

type WorkoutDisplayData = NonNullable<GetTodaysWorkoutResponse['workout']>;

interface TodayViewProps {
  todaysWorkout: WorkoutDisplayData | undefined;
  onStartWorkout: () => void;
  onSkipWorkout: (_reason: string) => Promise<void>;
  isSkipping: boolean;
}

export default function TodayView({
  todaysWorkout,
  onStartWorkout,
  onSkipWorkout,
  isSkipping,
}: Readonly<TodayViewProps>) {
  const [showSkipModal, setShowSkipModal] = useState(false);

  const handleSkipConfirm = async (reason: string) => {
    await onSkipWorkout(reason);
    setShowSkipModal(false);
  };


  if (!todaysWorkout) {
    return (
      <RestDayView 
        onViewSchedule={() => {}} // TODO: Wire to schedule page
        onBrowseRecovery={() => {}} // TODO: Wire to discovery
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <ScheduledWorkoutView 
        workout={todaysWorkout} 
        onStart={onStartWorkout}
        onSkip={() => setShowSkipModal(true)}
        layout="dashboard"
      />

      <SkipWorkoutModal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={handleSkipConfirm}
        isLoading={isSkipping}
      />
    </div>
  );
}



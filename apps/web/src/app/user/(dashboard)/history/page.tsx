'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import HistoryModal from './#components/history-modal';
import { ROUTES } from '@/lib/constants';

export default function HistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workoutHistoryQuery = workouts.useWorkoutHistory({
    json: {
      limit: 50,
      offset: 0,
    },
  });

  if (workoutHistoryQuery.isLoading) {
    return <LoadingSpinner variant="screen" text="Loading workout history..." />;
  }

  if (workoutHistoryQuery.error) {
    return (
      <ErrorPage
        title="History Loading Error"
        message="Unable to load your workout history."
        error={
          workoutHistoryQuery.error instanceof Error
            ? workoutHistoryQuery.error
            : new Error('Unknown error')
        }
        backHref={ROUTES.HOME}
      />
    );
  }

  const workoutHistory = workoutHistoryQuery.data?.workouts || [];

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
      <div className="bg-accent/20 text-muted-foreground mb-6 rounded-full p-6">
        <History size={48} />
      </div>
      <h1 className="text-foreground mb-2 text-2xl font-bold">Workout History</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        View your past workouts, achievements, and progress logs in detail.
        {workoutHistory.length > 0 && ` You have ${workoutHistory.length} workouts completed.`}
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-bold transition-transform hover:scale-105"
      >
        Open History
      </button>

      <HistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workouts={workoutHistory}
      />
    </div>
  );
}

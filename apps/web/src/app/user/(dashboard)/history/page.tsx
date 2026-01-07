'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Button } from '@/lib/components';
import HistoryModal from './#components/history-modal';
import { ROUTES } from '@/lib/constants';
import { safeFormatDateTime } from '@/lib/utils/date-format';

export default function HistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workoutHistoryQuery = workouts.useWorkoutHistory({
    query: {
      limit: '50',
      offset: '0',
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

  const workoutHistoryRaw = workoutHistoryQuery.data?.workouts || [];
  const isEmpty = workoutHistoryRaw.length === 0;

  const workoutHistory = workoutHistoryRaw.map(
    (w: workouts.GetWorkoutHistoryResponse['workouts'][number]) => ({
      id: w.id,
      date: safeFormatDateTime(w.date, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      workout: w.type.charAt(0).toUpperCase() + w.type.slice(1) + ' Workout', // Derive title
      duration: `${w.durationMinutes} min`,
      calories: 'N/A', // Not in API
      type: w.type,
    }),
  );

  if (isEmpty) {
    return (
      <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
        <div className="bg-accent/20 text-muted-foreground mb-6 rounded-full p-6">
          <History size={48} />
        </div>
        <h1 className="text-foreground mb-2 text-2xl font-bold">No Workouts Yet</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          You haven&apos;t completed any workouts yet. Start your journey by completing your first
          scheduled activity!
        </p>
        <Button onClick={() => (globalThis.location.href = ROUTES.USER.PLAN)} size="lg">
          View My Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
      <div className="bg-accent/20 text-muted-foreground mb-6 rounded-full p-6">
        <History size={48} />
      </div>
      <h1 className="text-foreground mb-2 text-2xl font-bold">Workout History</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        View your past workouts, achievements, and progress logs in detail. You have{' '}
        {workoutHistory.length} workouts completed.
      </p>
      <Button onClick={() => setIsModalOpen(true)} size="lg">
        Open History
      </Button>

      <HistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workouts={workoutHistory}
      />
    </div>
  );
}

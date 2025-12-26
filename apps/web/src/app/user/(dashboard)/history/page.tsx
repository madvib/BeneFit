'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import HistoryModal from '@/components/user/dashboard/history/history-modal';
import { useHistoryController } from '@/controllers';
import { LoadingSpinner, ErrorPage } from '@/components';

export default function HistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { workoutHistory, loading, error } = useHistoryController();

  if (loading) {
    return <LoadingSpinner variant="screen" text="Loading workout history..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="History Loading Error"
        message="Unable to load your workout history."
        error={error instanceof Error ? error : new Error('Unknown error')}
        backHref="/"
      />
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
      <div className="bg-accent/20 text-muted-foreground mb-6 rounded-full p-6">
        <History size={48} />
      </div>
      <h1 className="text-foreground mb-2 text-2xl font-bold">Workout History</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        View your past workouts, achievements, and progress logs in detail.
        {workoutHistory.length > 0 &&
          ` You have ${workoutHistory.length} workouts completed.`}
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

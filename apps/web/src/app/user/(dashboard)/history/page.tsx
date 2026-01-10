'use client';

import { useState } from 'react';
import { History, ChevronRight, Calendar, Clock, ArrowUpDown } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Button, PageHeader, Badge } from '@/lib/components';
import WorkoutDetailModal from './_components/history-modal';
import { ROUTES } from '@/lib/constants';
import { safeFormatDate } from '@/lib/utils/date-format';

export default function HistoryPage() {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

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

  const workoutHistory = workoutHistoryRaw.map((w) => ({
    id: w.id,
    date: safeFormatDate(w.recordedAt, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
    workout: w.workoutType.charAt(0).toUpperCase() + w.workoutType.slice(1) + ' Workout', // Derive title
    duration: `${w.performance.durationMinutes} min`,
    calories: `${w.performance.caloriesBurned || '---'} kcal`,
    type: w.workoutType,
  }));

  const selectedWorkout = workoutHistoryRaw.find((w) => w.id === selectedWorkoutId) || null;

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
    <div className="p-6 md:p-10">
      <div className="mb-2 flex items-start justify-between">
        <PageHeader
          title="Workout History"
          description="Track your progress and review past performance."
        />
        <Badge variant="accent" className="translate-y-1 transform rounded-lg px-4 py-2 text-sm">
          {workoutHistory.length} Total Sessions
        </Badge>
      </div>

      <div className="rounded-xl border shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                <th className="text-muted-foreground h-12 w-[100px] px-4 text-left align-middle font-medium sm:w-[200px] [&:has([role=checkbox])]:pr-0">
                  <button className="hover:text-foreground flex items-center gap-2">
                    Date <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0">
                  Workout
                </th>
                <th className="text-muted-foreground hidden h-12 px-4 text-left align-middle font-medium sm:table-cell [&:has([role=checkbox])]:pr-0">
                  Duration
                </th>
                <th className="text-muted-foreground hidden h-12 px-4 text-left align-middle font-medium md:table-cell [&:has([role=checkbox])]:pr-0">
                  Type
                </th>
                <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium [&:has([role=checkbox])]:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {workoutHistory.map((workout) => (
                <tr
                  key={workout.id}
                  className="hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer border-b transition-colors"
                  onClick={() => setSelectedWorkoutId(workout.id)}
                >
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="flex items-center gap-2 font-medium">
                      <Calendar className="text-muted-foreground sm:hidden" size={16} />
                      {workout.date}
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <span className="font-semibold">{workout.workout}</span>
                  </td>
                  <td className="hidden p-4 align-middle sm:table-cell [&:has([role=checkbox])]:pr-0">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      {workout.duration}
                    </div>
                  </td>
                  <td className="hidden p-4 align-middle md:table-cell [&:has([role=checkbox])]:pr-0">
                    <Badge variant="secondary" className="capitalize">
                      {workout.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-right align-middle [&:has([role=checkbox])]:pr-0">
                    <ChevronRight size={16} className="text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <WorkoutDetailModal
        isOpen={!!selectedWorkoutId}
        onClose={() => setSelectedWorkoutId(null)}
        workout={selectedWorkout}
      />
    </div>
  );
}

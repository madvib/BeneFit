'use client';

import { Dumbbell, Clock, Flame, Target, Play } from 'lucide-react';
import { useWorkoutController } from '@/controllers';
import { LoadingSpinner, ErrorPage, Card } from '@/components';

export default function TodaysWorkoutPage() {
  const {
    todaysWorkout,
    isLoading,
    error,
    startWorkout,
  } = useWorkoutController();

  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading today's workout..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Workout Loading Error"
        message="Unable to load today's workout."
        error={error instanceof Error ? error : new Error('Unknown error')}
        backHref="/"
      />
    );
  }

  const handleStartWorkout = () => {
    if (todaysWorkout?.id) {
      startWorkout(todaysWorkout.id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Today's Workout</h1>
        <p className="text-muted-foreground">Complete your planned workout to stay on track</p>
      </div>

      {todaysWorkout ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workout Info Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">{todaysWorkout.name || 'Today\'s Workout'}</h2>
                  <p className="text-muted-foreground mb-4">{todaysWorkout.description || 'Get ready to crush your fitness goals!'}</p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground" size={18} />
                      <span className="text-muted-foreground">{todaysWorkout.duration || '30-45 min'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="text-muted-foreground" size={18} />
                      <span className="text-muted-foreground">{todaysWorkout.calories || '250-350 cal'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="text-muted-foreground" size={18} />
                      <span className="text-muted-foreground">{todaysWorkout.focusArea || 'Full Body'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 p-3 rounded-full">
                  <Dumbbell className="text-primary" size={32} />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">Workout Plan</h3>
                <div className="space-y-3">
                  {todaysWorkout.exercises?.map((exercise: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                      <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">{exercise.sets} sets × {exercise.reps} reps</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Action Card */}
          <div>
            <Card className="p-6 h-full">
              <h3 className="font-semibold text-foreground mb-4">Workout Actions</h3>

              <div className="space-y-4">
                <button
                  onClick={handleStartWorkout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      Start Workout
                    </>
                  )}
                </button>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3">Today's Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium text-foreground">0/5</span>
                    </div>
                    <div className="bg-accent h-2 w-full rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-1/3 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-2">Up Next</h4>
                  <p className="text-sm text-muted-foreground">Rest Day - Tomorrow</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Dumbbell size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Workout for Today</h3>
          <p className="text-muted-foreground mb-6">Your coach hasn't assigned a workout for today.</p>
          <button className="bg-primary text-primary-foreground py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">
            Plan Workout
          </button>
        </Card>
      )}
    </div>
  );
}
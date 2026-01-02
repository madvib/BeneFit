'use client';

import { Clock, Dumbbell, Play } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Card } from '@/lib/components';

export default function TodaysWorkoutPage() {
  const todaysWorkoutQuery = workouts.useTodaysWorkout();
  const startWorkoutMutation = workouts.useStartWorkout();

  const todaysWorkout = todaysWorkoutQuery.data;
  const isLoading = todaysWorkoutQuery.isLoading || startWorkoutMutation.isPending;
  const error = todaysWorkoutQuery.error || startWorkoutMutation.error;

  const handleStartWorkout = async () => {
    if (todaysWorkout?.id) {
      await startWorkoutMutation.mutateAsync({
        param: { sessionId: todaysWorkout.id },
        json: { userName: '' }, // This should ideally be the user's name from profile
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-bold">Today's Workout</h1>
        <p className="text-muted-foreground">Complete your planned workout to stay on track</p>
      </div>

      {todaysWorkout ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Workout Info Card */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-foreground mb-2 text-2xl font-bold">
                    {todaysWorkout.type || "Today's Workout"}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Get ready for your scheduled training session.
                  </p>

                  <div className="mb-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground" size={18} />
                      <span className="text-muted-foreground">
                        {todaysWorkout.durationMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-full p-3">
                  <Dumbbell className="text-primary" size={32} />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-foreground mb-3 font-semibold">Workout Plan</h3>
                <div className="space-y-3">
                  {todaysWorkout.activities?.map((activity: any, idx: number) => (
                    <div key={idx} className="bg-accent flex items-start gap-3 rounded-lg p-3">
                      <span className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-foreground text-xs font-medium tracking-wider uppercase opacity-70">
                          {activity.type}
                        </p>
                        <p className="text-muted-foreground text-sm">{activity.instructions}</p>
                        <p className="text-primary mt-1 text-xs font-bold">
                          {activity.durationMinutes} min
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Action Card */}
          <div>
            <Card className="h-full p-6">
              <h3 className="text-foreground mb-4 font-semibold">Workout Actions</h3>

              <div className="space-y-4">
                <button
                  onClick={handleStartWorkout}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoadingSpinner text=" Starting..." />
                  ) : (
                    <>
                      <Play size={18} />
                      Start {todaysWorkout.type}
                    </>
                  )}
                </button>

                <div className="border-border border-t pt-4">
                  <h4 className="text-foreground mb-3 font-medium">Today's Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="text-foreground font-medium">0/5</span>
                    </div>
                    <div className="bg-accent h-2 w-full overflow-hidden rounded-full">
                      <div className="bg-primary h-full w-1/3 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="border-border border-t pt-4">
                  <h4 className="text-foreground mb-2 font-medium">Up Next</h4>
                  <p className="text-muted-foreground text-sm">Rest Day - Tomorrow</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Dumbbell size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-foreground mb-2 text-xl font-semibold">No Workout for Today</h3>
          <p className="text-muted-foreground mb-6">
            Your coach hasn't assigned a workout for today.
          </p>
          <button className="bg-primary text-primary-foreground rounded-lg px-6 py-2 transition-opacity hover:opacity-90">
            Plan Workout
          </button>
        </Card>
      )}
    </div>
  );
}

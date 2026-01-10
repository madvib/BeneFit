'use client';

import { Clock, Dumbbell, Play, SkipForward } from 'lucide-react';
import { Card, Button, LoadingSpinner, ErrorPage, PageHeader } from '@/lib/components';
import { workouts } from '@bene/react-api-client';
import SkipWorkoutModal from './skip-workout-modal';
import { useState } from 'react';

// Define the shape of the workout data as returned by the API
type WorkoutDisplayData = NonNullable<workouts.GetTodaysWorkoutResponse['workout']>;

interface TodayViewProps {
  todaysWorkout: WorkoutDisplayData | undefined;
  isLoading: boolean;
  error: unknown;
  onStartWorkout: () => void;
  onSkipWorkout: (_reason: string, _notes?: string) => Promise<void>;
  isStarting: boolean;
  isSkipping: boolean;
}

export default function TodayView({
  todaysWorkout,
  isLoading,
  error,
  onStartWorkout,
  onSkipWorkout,
  isStarting,
  isSkipping,
}: TodayViewProps) {
  const [showSkipModal, setShowSkipModal] = useState(false);

  // Handle the internal state of the modal here, but delegate action to parent
  const handleSkipConfirm = async (reason: string, notes?: string) => {
    await onSkipWorkout(reason, notes);
    setShowSkipModal(false);
  };

  if (isLoading && !todaysWorkout) {
    return <LoadingSpinner variant="screen" text="Loading today's workout..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Workout Error"
        message="Unable to load your workout for today."
        error={error as Error}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <PageHeader
          title="Today's Workout"
          description="Complete your planned workout to stay on track"
        />

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
                    {todaysWorkout.activities?.map((activity, idx: number) => (
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
                  <Button
                    onClick={onStartWorkout}
                    disabled={isLoading || isStarting}
                    isLoading={isStarting}
                    className="w-full"
                  >
                    {!isStarting && <Play size={18} className="mr-2" />}
                    Start {todaysWorkout.type || 'Workout'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowSkipModal(true)}
                    disabled={isLoading || isSkipping}
                    className="w-full"
                  >
                    <SkipForward size={18} className="mr-2" />
                    Skip Today
                  </Button>

                  <div className="border-border border-t pt-4">
                    <h4 className="text-foreground mb-3 font-medium">Session Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Activities</span>
                        <span className="text-foreground font-medium">
                          0/{todaysWorkout.activities?.length || 0}
                        </span>
                      </div>
                      <div className="bg-accent h-2 w-full overflow-hidden rounded-full">
                        <div className="bg-primary h-full w-0 rounded-full"></div>
                      </div>
                    </div>
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
              Your coach hasn&apos;t assigned a workout for today.
            </p>
          </Card>
        )}
      </div>

      <SkipWorkoutModal
        isOpen={showSkipModal}
        onClose={() => setShowSkipModal(false)}
        onConfirm={handleSkipConfirm}
        isLoading={isSkipping}
      />
    </>
  );
}

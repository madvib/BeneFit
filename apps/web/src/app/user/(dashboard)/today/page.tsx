'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Dumbbell, Play, SkipForward } from 'lucide-react';
import { workouts, profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Card, Button } from '@/lib/components';
import SkipWorkoutModal from './#components/skip-workout-modal';

export default function TodaysWorkoutPage() {
  const [showSkipModal, setShowSkipModal] = useState(false);

  const todaysWorkoutQuery = workouts.useTodaysWorkout();
  const profileQuery = profile.useProfile();
  const startWorkoutMutation = workouts.useStartWorkout();
  const skipWorkoutMutation = workouts.useSkipWorkout();

  const todaysWorkoutData = todaysWorkoutQuery.data;
  const todaysWorkout = todaysWorkoutData?.workout;
  const userProfile = profileQuery.data;

  const isLoading =
    todaysWorkoutQuery.isLoading ||
    profileQuery.isLoading ||
    startWorkoutMutation.isPending ||
    skipWorkoutMutation.isPending;

  const error =
    todaysWorkoutQuery.error ||
    profileQuery.error ||
    startWorkoutMutation.error ||
    skipWorkoutMutation.error;

  // Add router
  const router = useRouter();

  const handleStartWorkout = async () => {
    if (todaysWorkout?.workoutId && userProfile) {
      await startWorkoutMutation.mutateAsync({
        param: { sessionId: todaysWorkout.workoutId },
        json: { userName: userProfile.displayName || 'User' },
      });
      router.push(`/user/workout/${todaysWorkout.workoutId}`);
    }
  };

  const handleSkipWorkout = async (reason: string, _notes?: string) => {
    if (todaysWorkout?.workoutId) {
      await skipWorkoutMutation.mutateAsync({
        json: {
          planId: todaysWorkout.planId,
          workoutId: todaysWorkout.workoutId,
          reason,
        },
      });
      setShowSkipModal(false);
    }
  };

  if (isLoading && !todaysWorkout) {
    return <LoadingSpinner variant="screen" text="Loading today's workout..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Workout Error"
        message="Unable to load your workout for today."
        error={error}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-foreground text-3xl font-bold">Today&apos;s Workout</h1>
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
                    onClick={handleStartWorkout}
                    disabled={isLoading}
                    isLoading={startWorkoutMutation.isPending}
                    className="w-full"
                  >
                    {!startWorkoutMutation.isPending && <Play size={18} className="mr-2" />}
                    Start {todaysWorkout.type || 'Workout'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowSkipModal(true)}
                    disabled={isLoading}
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
        onConfirm={handleSkipWorkout}
        isLoading={skipWorkoutMutation.isPending}
      />
    </>
  );
}

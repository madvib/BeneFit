'use client';

import { useState } from 'react';
import { Clock, Dumbbell, Play, SkipForward, Star, Zap, Calendar } from 'lucide-react';
import { workouts } from '@bene/react-api-client';
import {
  Card,
  Button,
  LoadingSpinner,
  ErrorPage,
  SkipWorkoutModal,
  Badge,
  typography,
  IconBox,
  DateDisplay,
  MetricCard,
} from '@/lib/components';

// Define the shape of the workout data as returned by the API
type WorkoutDisplayData = NonNullable<workouts.GetTodaysWorkoutResponse['workout']>;

interface TodayViewProps {
  todaysWorkout: WorkoutDisplayData | undefined;
  isLoading: boolean;
  error: unknown;
  onStartWorkout: () => void;
  onSkipWorkout: (_reason: string) => Promise<void>;
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
  const handleSkipConfirm = async (reason: string) => {
    await onSkipWorkout(reason);
    setShowSkipModal(false);
  };

  if (isLoading && !todaysWorkout) {
    return <LoadingSpinner variant="screen" text="Preparing your session..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Connection Issue"
        message="Unable to retrieve your training plan for today."
        error={error as Error}
      />
    );
  }

  // --- Date Formatting ---

  const today = new Date();

  if (!todaysWorkout) {
    return (
      <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-6">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-blob absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="animation-delay-2000 animate-blob absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="animation-delay-4000 animate-blob absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[100px]" />
        </div>

        <Card className="border-primary/10 bg-background/60 flex max-w-md flex-col items-center border p-12 text-center shadow-2xl backdrop-blur-xl">
          <IconBox
            icon={Calendar}
            variant="ghost"
            className="bg-primary/5 animate-bounce-slow ring-primary/20 mb-8 h-24 w-24 rounded-full ring-1"
            iconClassName="text-primary opacity-80 h-12 w-12"
          />

          <h2 className={`${typography.h2} mb-3`}>Rest & Recovery</h2>

          <p className={`${typography.muted} mb-8 max-w-70`}>
            No workout specifically assigned for today. Take this time to recharge your energy for
            the next session.
          </p>

          <div className="w-full space-y-3">
            <Button
              variant="outline"
              onClick={() => {}}
              className={`${typography.p} border-primary/20 hover:bg-primary/5 h-12 w-full rounded-xl`}
            >
              View Weeks Schedule
            </Button>
            <Button
              variant="ghost"
              className={`${typography.labelXs} text-muted-foreground hover:text-primary w-full rounded-xl`}
            >
              Browse Active Recovery Sessions
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in bg-background min-h-screen pb-20 duration-700">
        {/* Dynamic Hero Section */}
        <div className="relative overflow-hidden pt-8 pb-12 md:pt-12 md:pb-24">
          <div className="bg-primary/10 absolute top-0 right-0 -m-20 h-96 w-96 rounded-full blur-[100px]" />
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

          <div className="relative z-10 container mx-auto px-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline" className="border-primary/20 bg-primary/5 px-3 py-1">
                <span className="bg-primary mr-2 h-1.5 w-1.5 rounded-full" />
                Today&apos;s Protocol
              </Badge>
              <p className={`${typography.mutedXs} opacity-60`}>
                <DateDisplay date={today} format="long" />
              </p>
            </div>

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h1 className={`${typography.displayLgResponsive} mb-4 capitalize`}>
                  {todaysWorkout.type || 'Training Session'}
                </h1>
                <p className={`${typography.lead} text-muted-foreground max-w-xl`}>
                  {'Focus on form and intensity. Your personalized plan is ready.'}
                </p>
              </div>

              {/* Key Stats */}
              <div className="flex gap-4">
                <MetricCard
                  label="Duration"
                  value={todaysWorkout.durationMinutes}
                  unit="min"
                  icon={Clock}
                  className="bg-transparent border-none shadow-none p-0"
                  bodyClassName="p-0 gap-1"
                />
                <div className="bg-border h-12 w-px" />
                <MetricCard
                  label="Activities"
                  value={todaysWorkout.activities?.length || 0}
                  icon={Zap}
                  className="bg-transparent border-none shadow-none p-0"
                  bodyClassName="p-0 gap-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto -mt-8 grid gap-8 px-6 lg:grid-cols-3">
          {/* Main Content: Activities */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className={`${typography.large} flex items-center gap-2 font-bold`}>
                <Dumbbell className="text-primary" size={24} /> Session Breakdown
              </h3>
            </div>

            <div className="space-y-4">
              {todaysWorkout.activities?.map((activity, idx) => (
                <div
                  key={idx}
                  className="group border-border bg-card hover:border-primary/50 hover:shadow-primary/5 relative overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-lg"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <Dumbbell size={80} />
                  </div>

                  <div className="relative z-10 flex gap-5">
                    <IconBox variant="muted" size="lg" className="rounded-xl">
                      {idx + 1}
                    </IconBox>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className={`${typography.large} font-bold capitalize`}>
                          {activity.type}
                        </h4>
                        <Badge variant="secondary" className="font-mono">
                          {activity.durationMinutes} min
                        </Badge>
                      </div>
                      <p className={`${typography.small} text-muted-foreground italic`}>
                        &quot;{activity.instructions}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="relative lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-primary/20 bg-background/50 overflow-hidden p-6 shadow-xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-3">
                  <IconBox icon={Star} variant="default" size="md" iconClassName="fill-current" />
                  <div>
                    <p className={`${typography.small} font-bold`}>Ready to start?</p>
                    <p className={`${typography.mutedXs}`}>Commit to the process.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={onStartWorkout}
                    disabled={isLoading || isStarting}
                    isLoading={isStarting}
                    size="lg"
                    className={`${typography.p} shadow-primary/20 w-full gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    {!isStarting && <Play size={20} className="fill-current" />}
                    Start Session
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowSkipModal(true)}
                    disabled={isLoading || isSkipping}
                    className="text-muted-foreground hover:text-foreground w-full"
                  >
                    <SkipForward size={16} className="mr-2" />
                    Skip Workout
                  </Button>
                </div>
              </Card>

              {/* Progress / Context */}
              <div className="border-border bg-card/50 rounded-2xl border p-6">
                <p className={`${typography.small} text-muted-foreground mb-3`}>
                  Session Focus
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Strength</Badge>
                  <Badge variant="outline">Endurance</Badge>
                  <Badge variant="outline">Technique</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
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

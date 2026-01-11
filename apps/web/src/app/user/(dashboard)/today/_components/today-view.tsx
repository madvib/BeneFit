'use client';

import { useState } from 'react';
import { Clock, Dumbbell, Play, SkipForward, Star, Zap, Calendar } from 'lucide-react';
import {
  Card,
  Button,
  LoadingSpinner,
  ErrorPage,
  SkipWorkoutModal,
  Typography,
  Badge,
} from '@/lib/components';
import { workouts } from '@bene/react-api-client';

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
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

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
          <div className="bg-primary/5 animate-bounce-slow ring-primary/20 mb-8 flex h-24 w-24 items-center justify-center rounded-full ring-1">
            <Calendar size={48} className="text-primary opacity-80" />
          </div>

          <Typography variant="h2" className="mb-3 text-3xl font-black tracking-tight">
            Rest & Recovery
          </Typography>

          <Typography variant="muted" className="mb-8 max-w-[280px] text-base leading-relaxed">
            No workout specifically assigned for today. Take this time to recharge your energy for
            the next session.
          </Typography>

          <div className="w-full space-y-3">
            <Button
              variant="outline"
              onClick={() => {}}
              className="border-primary/20 hover:bg-primary/5 h-12 w-full rounded-xl font-semibold"
            >
              View Weeks Schedule
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary w-full rounded-xl text-xs"
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
              <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
                {dateString}
              </Typography>
            </div>

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <Typography
                  variant="h1"
                  className="mb-4 text-5xl font-black tracking-tight capitalize md:text-6xl"
                >
                  {todaysWorkout.type || 'Training Session'}
                </Typography>
                <Typography variant="lead" className="text-muted-foreground max-w-xl text-lg">
                  {todaysWorkout?.description ||
                    'Focus on form and intensity. Your personalized plan is ready.'}
                </Typography>
              </div>

              {/* Key Stats */}
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <Clock size={16} /> Duration
                  </div>
                  <Typography variant="h3" className="font-mono text-3xl font-bold">
                    {todaysWorkout.durationMinutes}
                    <span className="text-muted-foreground ml-1 text-sm font-normal">min</span>
                  </Typography>
                </div>
                <div className="bg-border h-12 w-px" />
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                    <Zap size={16} /> Activities
                  </div>
                  <Typography variant="h3" className="font-mono text-3xl font-bold">
                    {todaysWorkout.activities?.length || 0}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto -mt-8 grid gap-8 px-6 lg:grid-cols-3">
          {/* Main Content: Activities */}
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <Typography variant="h3" className="flex items-center gap-2 text-xl font-bold">
                <Dumbbell className="text-primary" size={24} /> Session Breakdown
              </Typography>
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
                    <div className="bg-accent text-muted-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <Typography variant="h4" className="text-lg font-bold capitalize">
                          {activity.type}
                        </Typography>
                        <Badge variant="secondary" className="font-mono">
                          {activity.durationMinutes} min
                        </Badge>
                      </div>
                      <Typography variant="muted" className="text-sm italic">
                        &quot;{activity.instructions}&quot;
                      </Typography>
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
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Star size={20} className="fill-current" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-bold uppercase">
                      Ready to start?
                    </Typography>
                    <Typography variant="muted" className="text-xs">
                      Commit to the process.
                    </Typography>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={onStartWorkout}
                    disabled={isLoading || isStarting}
                    isLoading={isStarting}
                    size="lg"
                    className="shadow-primary/20 w-full gap-2 text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
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
                <Typography variant="small" className="text-muted-foreground mb-3 font-bold">
                  Session Focus
                </Typography>
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

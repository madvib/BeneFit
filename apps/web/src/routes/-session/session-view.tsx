import { useState, useEffect } from 'react';
import { ChevronRight, Trophy } from 'lucide-react';
import type { WorkoutSession } from '@bene/react-api-client';
import { Button, typography } from '@/lib/components';
import { SessionHeader } from './_components/session-header';
import { ActivityPhase } from './_components/activity-phase';
import { RestTimer } from './_components/rest-timer';

interface SetPerformanceData {
  reps: number;
  weight: number;
  rpe?: number;
}

interface SessionViewProps {
  session: WorkoutSession;
  onComplete: (_data: {
    elapsedSeconds: number;
    activityPerformance: SetPerformanceData[][][];
  }) => void;
  onAbort: () => void;
}

export default function SessionView({ session, onComplete, onAbort }: Readonly<SessionViewProps>) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);
  const [activityPerformance, setActivityPerformance] = useState<SetPerformanceData[][][]>(
    session.activities.map((a) => (a.structure?.exercises || []).map(() => [])),
  );
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSetComplete = (
    activityIdx: number,
    exerciseIdx: number,
    setIdx: number,
    data: SetPerformanceData,
  ) => {
    setActivityPerformance((prev) => {
      const next = [...prev];
      const activity = [...(next[activityIdx] || [])];
      const exercise = [...(activity[exerciseIdx] || [])];
      exercise[setIdx] = data;
      activity[exerciseIdx] = exercise;
      next[activityIdx] = activity;
      return next;
    });

    // Trigger rest if exercise has rest duration
    const exercise = session.activities[activityIdx]?.structure?.exercises?.[exerciseIdx];
    if (exercise && 'rest' in exercise && exercise.rest) {
      setRestDuration(exercise.rest);
      setIsResting(true);
    }
  };

  const handleNextPhase = () => {
    if (currentActivityIndex < session.activities.length - 1) {
      setCompletedActivities((prev) => [...prev, currentActivityIndex]);
      setCurrentActivityIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isCurrentPhaseComplete = () => {
    const activity = session.activities[currentActivityIndex];
    if (!activity) return false;

    const performance = activityPerformance[currentActivityIndex];
    if (!performance) return false;

    if (!activity.structure?.exercises) return true;

    return activity.structure.exercises.every(
      (ex, exIdx) => (performance[exIdx]?.filter(Boolean).length || 0) === ex.sets,
    );
  };

  const totalPhases = session.activities.length;

  return (
    <div className="bg-background min-h-screen pb-40">
      <SessionHeader
        session={session}
        elapsedSeconds={elapsedSeconds}
        currentStep={completedActivities.length}
        totalSteps={totalPhases}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {session.activities.map((activity, idx) => {
            const isActive = idx === currentActivityIndex;
            const isCompleted = completedActivities.includes(idx);

            // Only show siblings close to active
            if (Math.abs(idx - currentActivityIndex) > 1 && !isCompleted) return null;

            return (
              <ActivityPhase
                key={idx}
                activity={activity}
                isActive={isActive}
                isCompleted={isCompleted}
                onSetComplete={(exIdx, setIdx, data) =>
                  handleSetComplete(idx, exIdx, setIdx, data)
                }
                completedExercises={activityPerformance[idx] || []}
              />
            );
          })}
        </div>
      </div>

      {/* Persistent Action Bar */}
      <div className="bg-background/80 fixed right-0 bottom-0 left-0 z-40 border-t border-white/5 p-6 backdrop-blur-xl">
        <div className="container mx-auto flex max-w-2xl items-center gap-4">
          <Button
            variant="ghost"
            onClick={onAbort}
            className={`${typography.labelXs} rounded-2xl bg-red-500/10 p-6 text-red-500 hover:bg-red-500/20`}
          >
            Abort
          </Button>

          {currentActivityIndex === totalPhases - 1 && isCurrentPhaseComplete() ? (
            <Button
              onClick={() => onComplete({ elapsedSeconds, activityPerformance })}
              className={`${typography.labelSm} h-16 flex-1 gap-3 rounded-3xl bg-emerald-500 shadow-2xl shadow-emerald-500/20`}
            >
              <Trophy size={20} className="animate-bounce" />
              Finish Session
            </Button>
          ) : (
            <Button
              onClick={handleNextPhase}
              disabled={!isCurrentPhaseComplete()}
              className={`${typography.labelSm} shadow-primary/20 h-16 flex-1 gap-3 rounded-3xl shadow-2xl`}
            >
              Next Phase
              <ChevronRight size={20} />
            </Button>
          )}
        </div>
      </div>

      {isResting && (
        <RestTimer durationSeconds={restDuration} onComplete={() => setIsResting(false)} />
      )}
    </div>
  );
}

'use client';

import { Button, Card, typography } from '@/lib/components';
import { CheckCircle, Calendar } from 'lucide-react';

interface PreviewWorkout {
  day: string;
  summary: string;
  type: string;
}

interface PlanPreviewData {
  planId: string;
  name: string;
  durationWeeks: number;
  workoutsPerWeek: number;
  preview: {
    weekNumber: number;
    workouts: PreviewWorkout[];
  };
}

interface PlanPreviewProps {
  planData: PlanPreviewData;
  onActivate: (_id: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function PlanPreview({
  planData,
  onActivate,
  onCancel,
  isLoading,
}: Readonly<PlanPreviewProps>) {
  if (!planData) return null;

  const { planId, name, durationWeeks, workoutsPerWeek, preview } = planData;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle size={32} />
        </div>
        <h1 className={`${typography.h1} mb-2`}>Plan Generated!</h1>
        <p className={typography.muted}>Here is a preview of your personalized plan.</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="text-muted-foreground flex flex-col items-center justify-center p-4 text-center">
          <h3 className={`${typography.mutedXs} mb-1 font-semibold uppercase`}>Duration</h3>
          <p className={`${typography.h2} text-foreground`}>{durationWeeks} Weeks</p>
        </Card>
        <Card className="text-muted-foreground flex flex-col items-center justify-center p-4 text-center">
          <h3 className={`${typography.mutedXs} mb-1 font-semibold uppercase`}>Frequency</h3>
          <p className={`${typography.h2} text-foreground`}>{workoutsPerWeek} / Week</p>
        </Card>
        <Card className="text-muted-foreground flex flex-col items-center justify-center p-4 text-center">
          <h3 className={`${typography.mutedXs} mb-1 font-semibold uppercase`}>Focus</h3>
          <p className={`${typography.h4} text-foreground truncate px-2`}>{name}</p>
        </Card>
      </div>

      <Card className="mb-8 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="text-primary" size={20} />
          <h3 className={`${typography.large} font-bold`}>Week 1 Preview</h3>
        </div>

        <div className="space-y-3">
          {preview?.workouts?.map((workout: PreviewWorkout, idx: number) => (
            <div
              key={idx}
              className="bg-accent/50 border-border flex items-center rounded-lg border p-3"
            >
              <div className={`${typography.mutedXs} w-16 font-bold`}>{workout.day}</div>
              <div className="flex-1">
                <p className={`${typography.small} text-foreground font-semibold`}>
                  {workout.summary}
                </p>
                <p className={`${typography.mutedXs} capitalize`}>{workout.type}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
          size="lg"
        >
          Discard
        </Button>
        <Button
          onClick={() => onActivate(planId)}
          isLoading={isLoading}
          className="flex-1"
          size="lg"
        >
          Activate Plan
        </Button>
      </div>
    </div>
  );
}

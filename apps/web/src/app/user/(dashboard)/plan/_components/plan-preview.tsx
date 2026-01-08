'use client';

import { Card, Button } from '@/lib/components';
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

export default function PlanPreview({
  planData,
  onActivate,
  onCancel,
  isLoading,
}: PlanPreviewProps) {
  if (!planData) return null;

  const { planId, name, durationWeeks, workoutsPerWeek, preview } = planData;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle size={32} />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Plan Generated!</h1>
        <p className="text-muted-foreground">Here is a preview of your personalized plan.</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-muted-foreground mb-1 font-semibold">Duration</h3>
          <p className="text-2xl font-bold">{durationWeeks} Weeks</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-muted-foreground mb-1 font-semibold">Frequency</h3>
          <p className="text-2xl font-bold">{workoutsPerWeek} / Week</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 text-center">
          <h3 className="text-muted-foreground mb-1 font-semibold">Focus</h3>
          <p className="truncate px-2 text-lg font-bold">{name}</p>
        </Card>
      </div>

      <Card className="mb-8 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="text-primary" size={20} />
          <h3 className="text-xl font-bold">Week 1 Preview</h3>
        </div>

        <div className="space-y-3">
          {preview?.workouts?.map((workout: PreviewWorkout, idx: number) => (
            <div
              key={idx}
              className="bg-accent/50 border-border flex items-center rounded-lg border p-3"
            >
              <div className="text-muted-foreground w-16 text-sm font-bold uppercase">
                {workout.day}
              </div>
              <div className="flex-1">
                <p className="text-foreground font-semibold">{workout.summary}</p>
                <p className="text-muted-foreground text-xs capitalize">{workout.type}</p>
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

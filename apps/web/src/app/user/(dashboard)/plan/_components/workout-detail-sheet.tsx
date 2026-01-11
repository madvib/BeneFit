'use client';

import { useEscapeKey } from '@/lib/hooks/use-escape-key';
import {
  CheckCircle2,
  Dumbbell,
  Target,
  AlertCircle,
  Lightbulb,
  X,
  Zap,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import type { WorkoutTemplate } from '@bene/shared';
import { Badge, Typography, Card } from '@/lib/components';

interface WorkoutDetailSheetProps {
  workout: WorkoutTemplate;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
}

const importanceConfig = {
  optional: { variant: 'secondary' as const, label: 'Optional' },
  recommended: { variant: 'default' as const, label: 'Recommended' },
  key: { variant: 'success' as const, label: 'Key Workout' },
  critical: { variant: 'error' as const, label: 'Critical' },
};

export function WorkoutDetailSheet({ workout, open, onOpenChange }: WorkoutDetailSheetProps) {
  // Close on Escape key
  useEscapeKey(() => onOpenChange(false), open);

  if (!open) return null;

  const importanceStyle = importanceConfig[workout.importance];

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div className="bg-background ring-border/50 animate-in zoom-in-95 relative m-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl shadow-2xl ring-1 duration-300">
        {/* Header */}
        <div className="bg-background border-border/50 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-6 py-5 sm:px-8">
          <div className="flex-1">
            <Typography
              variant="h2"
              className="mb-1 text-2xl leading-none font-black tracking-tighter capitalize italic"
            >
              {workout.title}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography
                variant="muted"
                className="text-xs font-black tracking-widest uppercase"
              >
                {workout.type} • Day {workout.dayOfWeek + 1}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden flex-col items-end gap-1 sm:flex">
              <Badge
                variant={importanceStyle.variant}
                className="py-0.5 font-black tracking-tighter uppercase"
              >
                {importanceStyle.label}
              </Badge>
              <Badge
                variant="outline"
                className="border-primary/20 text-primary py-0.5 font-black tracking-tighter uppercase"
              >
                {workout.category}
              </Badge>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="bg-muted text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="no-scrollbar max-h-[75vh] space-y-8 overflow-y-auto p-6 sm:p-8">
          {/* Workout Goals Summary */}
          {workout.goals && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 text-primary rounded-lg p-2">
                  <Target size={18} />
                </div>
                <Typography
                  variant="h4"
                  className="text-sm font-black tracking-widest uppercase italic"
                >
                  Primary Metrics
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {workout.goals.volume && (
                  <Card className="flex flex-col justify-between p-4 shadow-sm">
                    <Typography
                      variant="muted"
                      className="mb-2 block text-[10px] font-black tracking-widest uppercase opacity-70"
                    >
                      Volume Target
                    </Typography>
                    <Typography variant="small" className="text-sm font-black">
                      {workout.goals.volume.totalSets} Sets <br />{' '}
                      {workout.goals.volume.totalReps} Reps
                    </Typography>
                  </Card>
                )}
                {workout.goals.distance && (
                  <Card className="flex flex-col justify-between p-4 shadow-sm">
                    <Typography
                      variant="muted"
                      className="mb-2 block text-[10px] font-black tracking-widest uppercase opacity-70"
                    >
                      Distance
                    </Typography>
                    <Typography variant="small" className="text-sm font-black">
                      {workout.goals.distance.value} {workout.goals.distance.unit}
                    </Typography>
                  </Card>
                )}
                {workout.goals.duration && (
                  <Card className="flex flex-col justify-between p-4 shadow-sm">
                    <Typography
                      variant="muted"
                      className="mb-2 block text-[10px] font-black tracking-widest uppercase opacity-70"
                    >
                      Duration
                    </Typography>
                    <Typography variant="small" className="text-sm font-black">
                      {workout.goals.duration.value} min
                    </Typography>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Activities List */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary rounded-lg p-2">
                <Layers size={18} />
              </div>
              <Typography
                variant="h4"
                className="text-sm font-black tracking-widest uppercase italic"
              >
                Workout Structure
              </Typography>
            </div>

            <div className="space-y-4">
              {workout.activities.map((activity, idx) => (
                <Card key={idx} className="border-border/40 overflow-hidden shadow-sm">
                  <div className="bg-muted/30 border-border/40 flex items-center justify-between border-b px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">
                        <ChevronRight size={16} />
                      </div>
                      <Typography variant="small" className="font-black capitalize">
                        {activity.name}
                      </Typography>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-background border-border/50 border text-[9px] font-bold tracking-wider uppercase"
                    >
                      {activity.type}
                    </Badge>
                  </div>

                  <div className="space-y-4 p-5">
                    {/* Exercise Structure */}
                    {activity.structure?.exercises && (
                      <div className="space-y-2">
                        {activity.structure.exercises.map((exercise, exIdx) => (
                          <div
                            key={exIdx}
                            className="bg-background/50 hover:bg-accent/30 border-border/30 rounded-xl border p-3 transition-colors"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <Typography
                                variant="small"
                                className="text-foreground/90 font-bold"
                              >
                                {exercise.name}
                              </Typography>
                              <div className="text-muted-foreground/50">
                                <Zap size={14} />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex min-w-[80px] items-center gap-1.5">
                                <Dumbbell size={14} className="text-muted-foreground/70" />
                                <Typography variant="muted" className="text-xs font-medium">
                                  {exercise.sets} × {exercise.reps}
                                </Typography>
                              </div>
                              {exercise.weight && (
                                <div className="flex items-center gap-1.5">
                                  <div className="bg-border h-1 w-1 rounded-full" />
                                  <Typography variant="muted" className="text-xs font-medium">
                                    {exercise.weight}kg
                                  </Typography>
                                </div>
                              )}
                              {exercise.rest && (
                                <div className="flex items-center gap-1.5">
                                  <div className="bg-border h-1 w-1 rounded-full" />
                                  <Typography variant="muted" className="text-xs font-medium">
                                    {exercise.rest}s
                                  </Typography>
                                </div>
                              )}
                            </div>
                            {exercise.notes && (
                              <div className="text-muted-foreground mt-2 flex items-start gap-2">
                                <Info size={12} className="mt-0.5 shrink-0 opacity-70" />
                                <Typography variant="muted" className="text-[10px] italic">
                                  {exercise.notes}
                                </Typography>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Instructions */}
                    {activity.instructions && activity.instructions.length > 0 && (
                      <div className="bg-accent/10 border-border/30 rounded-xl border p-4">
                        <Typography
                          variant="muted"
                          className="mb-3 block text-[10px] font-black tracking-widest uppercase opacity-60"
                        >
                          Coach Methodology
                        </Typography>
                        <ul className="space-y-2">
                          {activity.instructions.map((instruction, instIdx) => (
                            <li key={instIdx} className="flex gap-3">
                              <div className="bg-primary/20 text-primary mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold">
                                {instIdx + 1}
                              </div>
                              <Typography variant="muted" className="text-xs leading-relaxed">
                                {instruction}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Coach Notes */}
          {workout.coachNotes && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-600">
                  <Lightbulb size={18} />
                </div>
                <Typography
                  variant="h4"
                  className="text-sm font-black tracking-widest uppercase italic"
                >
                  Strategic Insights
                </Typography>
              </div>
              <div className="rounded-r-xl border-l-4 border-yellow-500 bg-yellow-500/5 p-5">
                <Typography
                  variant="muted"
                  className="text-foreground/80 text-sm leading-relaxed font-medium italic"
                >
                  &ldquo;{workout.coachNotes}&rdquo;
                </Typography>
              </div>
            </div>
          )}

          {/* Alternatives */}
          {workout.alternatives && workout.alternatives.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
                  <AlertCircle size={18} />
                </div>
                <Typography
                  variant="h4"
                  className="text-sm font-black tracking-widest uppercase italic"
                >
                  Alternative Paths
                </Typography>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {workout.alternatives.map((alt, idx) => (
                  <Card key={idx} className="border-dashed p-4 shadow-sm">
                    <Typography variant="small" className="mb-2 block font-black capitalize">
                      {alt.reason}
                    </Typography>
                    <div className="space-y-2">
                      {alt.activities.map((act, actIdx) => (
                        <div key={actIdx} className="flex items-center gap-2">
                          <div className="bg-primary/40 h-1.5 w-1.5 rounded-full" />
                          <Typography
                            variant="muted"
                            className="truncate text-xs font-bold capitalize"
                          >
                            {act.name}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {workout.status === 'completed' && (
          <div className="flex items-center justify-center gap-3 bg-emerald-500 p-4 text-white">
            <CheckCircle2 className="h-5 w-5" />
            <Typography variant="small" className="font-black tracking-widest uppercase">
              Workout Perfectly Executed
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

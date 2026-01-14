'use client';

import { Badge, Card, Modal, typography } from '@/lib/components';
import {
  CheckCircle2,
  Dumbbell,
  Target,
  AlertCircle,
  Lightbulb,
  Zap,
  ChevronRight,
  Info,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import type { WorkoutTemplate, Exercise } from '@bene/shared';

interface WorkoutDetailSheetProps {
  readonly workout: WorkoutTemplate | null;
  readonly open: boolean;
  readonly onOpenChange: (_open: boolean) => void;
}

export function WorkoutDetailSheet({
  workout,
  open,
  onOpenChange,
}: WorkoutDetailSheetProps) {
  if (!workout) return null;

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      size="lg"
      showCloseButton={true}
      title={workout.title}
      description={`${workout.type} • Day ${workout.dayOfWeek + 1}`}
      className="p-0"
    >
      <div className="space-y-8 p-6 sm:p-8">
        <HeaderBadges workout={workout} />
        <GoalsSection goals={workout.goals} />
        <ActivitiesSection activities={workout.activities} />
        <CoachNotes notes={workout.coachNotes} />
        <AlternativesSection alternatives={workout.alternatives} />
        <CompletionFooter status={workout.status} />
      </div>
    </Modal>
  );
}

// --- Sub-components ---

function HeaderBadges({ workout }: { readonly workout: WorkoutTemplate }) {
  const importanceStyle = ((importance) => {
    switch (importance) {
      case 'critical':
        return { variant: 'error' as const, label: 'Critical' };
      case 'key':
        return { variant: 'warning' as const, label: 'Key Session' };
      case 'recommended':
        return { variant: 'primaryLight' as const, label: 'Recommended' };
      default:
        return { variant: 'secondary' as const, label: 'Optional' };
    }
  })(workout.importance);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={importanceStyle.variant} className={typography.labelXs}>
        {importanceStyle.label}
      </Badge>
      <Badge variant="outline" className={`${typography.labelXs} border-primary/20 text-primary`}>
        {workout.category}
      </Badge>
    </div>
  );
}

function GoalsSection({ goals }: { readonly goals: WorkoutTemplate['goals'] }) {
  if (!goals) return null;

  return (
    <div className="space-y-4">
      <SectionHeader icon={Target} label="Primary Metrics" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {goals.volume && (
          <GoalCard
            label="Volume Target"
            value={`${goals.volume.totalSets} Sets`}
            subValue={`${goals.volume.totalReps} Reps`}
          />
        )}
        {goals.distance && (
          <GoalCard label="Distance" value={`${goals.distance.value} ${goals.distance.unit}`} />
        )}
        {goals.duration && <GoalCard label="Duration" value={`${goals.duration.value} min`} />}
      </div>
    </div>
  );
}

function GoalCard({
  label,
  value,
  subValue,
}: {
 readonly label: string;
 readonly value: string;
 readonly subValue?: string;
}) {
  return (
    <Card className="flex flex-col justify-between p-4 shadow-sm">
      <p className={`${typography.mutedXs} mb-2 block opacity-50`}>{label}</p>
      <p className={`${typography.small} font-bold`}>
        {value}
        {subValue && (
          <>
            <br /> {subValue}
          </>
        )}
      </p>
    </Card>
  );
}

function ActivitiesSection({ activities }: { readonly activities: WorkoutTemplate['activities'] }) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Layers} label="Workout Structure" />
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <ActivityCard key={idx} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { readonly activity: WorkoutTemplate['activities'][number] }) {
  return (
    <Card className="border-border/40 overflow-hidden shadow-sm">
      <div className="bg-muted/30 border-border/40 flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-3">
          <ChevronRight size={16} className="text-muted-foreground" />
          <p className={`${typography.small} font-bold capitalize`}>{activity.name}</p>
        </div>
        <Badge
          variant="secondary"
          className={`${typography.mutedXs} bg-background border-border/50 border opacity-80`}
        >
          {activity.type}
        </Badge>
      </div>

      <div className="space-y-4 p-5">
        {activity.structure?.exercises && (
          <div className="space-y-2">
            {activity.structure.exercises.map((exercise, idx) => (
              <ExerciseRow key={idx} exercise={exercise} />
            ))}
          </div>
        )}

        {activity.instructions && activity.instructions.length > 0 && (
          <div className="bg-accent/10 border-border/30 rounded-xl border p-4">
            <p className={`${typography.mutedXs} mb-3 block opacity-50`}>Coach Methodology</p>
            <ul className="space-y-2">
              {activity.instructions.map((inst, idx) => (
                <li key={idx} className="flex gap-3">
                  <div
                    className={`${typography.small} bg-primary/20 text-primary mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-bold`}
                  >
                    {idx + 1}
                  </div>
                  <p className={`${typography.mutedXs} leading-relaxed`}>{inst}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

function ExerciseRow({ exercise }: { readonly exercise: Exercise }) {
  return (
    <div className="bg-background/50 hover:bg-accent/30 border-border/30 rounded-xl border p-3 transition-colors">
      <div className="mb-2 flex items-start justify-between">
        <p className={`${typography.small} text-foreground/90 font-bold`}>{exercise.name}</p>
        <Zap size={14} className="text-muted-foreground/50" />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <ExerciseMetric icon={Dumbbell} label={`${exercise.sets} × ${exercise.reps}`} />
        {exercise.weight && <ExerciseMetric type="dot" label={`${exercise.weight}kg`} />}
        {exercise.rest && <ExerciseMetric type="dot" label={`${exercise.rest}s`} />}
      </div>
      {exercise.notes && (
        <div className="text-muted-foreground mt-2 flex items-start gap-2">
          <Info size={12} className="mt-0.5 shrink-0 opacity-70" />
          <p className={`${typography.mutedXs} italic opacity-60`}>{exercise.notes}</p>
        </div>
      )}
    </div>
  );
}

function ExerciseMetric({
  icon: Icon,
  label,
  type,
}: {
  readonly icon?: LucideIcon;
  readonly label: string;
  readonly type?: 'dot';
}) {
  if (type === 'dot') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="bg-border h-1 w-1 rounded-full" />
        <p className={`${typography.mutedXs} font-bold opacity-80`}>{label}</p>
      </div>
    );
  }
  return (
    <div className="flex min-w-[80px] items-center gap-1.5">
      {Icon && <Icon size={14} className="text-muted-foreground/70" />}
      <p className={`${typography.mutedXs} font-bold opacity-80`}>{label}</p>
    </div>
  );
}

function CoachNotes({ notes }: { readonly notes?: string }) {
  if (!notes) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-600">
          <Lightbulb size={18} />
        </div>
        <h4 className={`${typography.labelXs} opacity-60`}>Strategic Insights</h4>
      </div>
      <div className="rounded-r-xl border-l-4 border-yellow-500 bg-yellow-500/5 p-5">
        <p className={`${typography.small} text-foreground/80 leading-relaxed font-bold italic`}>
          &ldquo;{notes}&rdquo;
        </p>
      </div>
    </div>
  );
}

function AlternativesSection({
  alternatives,
}: {
  readonly alternatives?: WorkoutTemplate['alternatives'];
}) {
  if (!alternatives?.length) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
          <AlertCircle size={18} />
        </div>
        <h4 className={`${typography.labelXs} opacity-60`}>Alternative Paths</h4>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {alternatives.map((alt, idx) => (
          <Card key={idx} className="border-dashed p-4 shadow-sm">
            <p className={`${typography.small} mb-2 block font-bold capitalize`}>{alt.reason}</p>
            <div className="space-y-2">
              {alt.activities.map((act, actIdx) => (
                <div key={actIdx} className="flex items-center gap-2">
                  <div className="bg-primary/40 h-1.5 w-1.5 rounded-full" />
                  <p className={`${typography.mutedXs} truncate font-bold capitalize opacity-80`}>
                    {act.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompletionFooter({ status }: { readonly status: WorkoutTemplate['status'] }) {
  if (status !== 'completed') return null;
  return (
    <div className="-mx-8 -mb-8 flex items-center justify-center gap-3 rounded-b-[32px] bg-emerald-500 p-4 text-white sm:-mx-10 sm:-mb-10">
      <CheckCircle2 className="h-5 w-5" />
      <p className={`${typography.labelXs} italic`}>Workout Perfectly Executed</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, label }: { readonly icon: LucideIcon; readonly label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/20 text-primary rounded-lg p-2">
        <Icon size={18} />
      </div>
      <h4 className={`${typography.labelXs} opacity-60`}>{label}</h4>
    </div>
  );
}

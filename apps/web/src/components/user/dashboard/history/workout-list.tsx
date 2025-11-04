import WorkoutCard from './workout-card';

interface Workout {
  id: string;
  date: string; // ISO string
  type: string;
  duration: string;
  calories: number;
  distance?: string;
  sets?: number;
  laps?: number;
}

interface WorkoutListProps {
  workouts: Workout[];
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

export default function WorkoutList({ 
  workouts, 
  loading = false, 
  onEdit, 
  onDelete,
  emptyMessage = "No workouts found matching your criteria" 
}: WorkoutListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="bg-background p-8 rounded-xl border border-muted text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
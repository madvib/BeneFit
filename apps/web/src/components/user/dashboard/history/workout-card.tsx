interface WorkoutCardProps {
  workout: {
    id: string;
    date: string; // ISO string
    type: string;
    duration: string;
    calories: number;
    distance?: string;
    sets?: number;
    laps?: number;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function WorkoutCard({ workout, onEdit, onDelete }: WorkoutCardProps) {
  return (
    <div className="bg-background p-4 rounded-xl border border-muted hover:shadow-md transition-shadow w-full">
      {/* Mobile List View */}
      <div className="md:hidden">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{workout.type}</h3>
            <p className="text-muted-foreground text-sm">
              {new Date(workout.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {workout.calories} cal
            </span>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{workout.duration}</span>
          </div>

          {workout.distance && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium">{workout.distance}</span>
            </div>
          )}

          {workout.sets !== undefined && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Sets:</span>
              <span className="font-medium">{workout.sets} sets</span>
            </div>
          )}

          {workout.laps !== undefined && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Laps:</span>
              <span className="font-medium">{workout.laps}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          {onEdit && (
            <button className="p-2 rounded-full hover:bg-accent" onClick={() => onEdit(workout.id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              className="p-2 rounded-full hover:bg-accent text-red-500"
              onClick={() => onDelete(workout.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:grid grid-cols-12 gap-4">
        <div className="col-span-2 font-medium">
          {new Date(workout.date).toLocaleDateString()}
        </div>
        <div className="col-span-2 font-medium">{workout.type}</div>
        <div className="col-span-2">{workout.duration}</div>
        <div className="col-span-3">
          <div className="flex flex-wrap gap-2">
            {workout.distance && (
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                {workout.distance}
              </span>
            )}
            {workout.sets !== undefined && (
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                {workout.sets} sets
              </span>
            )}
            {workout.laps !== undefined && (
              <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                {workout.laps}
              </span>
            )}
          </div>
        </div>
        <div className="col-span-2">{workout.calories}</div>
        <div className="col-span-1 flex space-x-2">
          {onEdit && (
            <button 
              className="p-2 rounded-full hover:bg-accent"
              onClick={() => onEdit(workout.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button 
              className="p-2 rounded-full hover:bg-accent text-red-500"
              onClick={() => onDelete(workout.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
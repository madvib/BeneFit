import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { CompletedWorkout, WorkoutSession } from '@bene/shared';
import { Button, typography } from '@/lib/components';
import ActivityListTile from './activity-list-tile';

// Union type for any item that can appear in the history list
export type HistoryItem = CompletedWorkout | WorkoutSession;

interface WorkoutListProps {
  workouts: HistoryItem[];
  loading?: boolean;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  emptyMessage?: string;
}

export default function WorkoutList(data: WorkoutListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredData = useMemo(() => {
    const workouts = data.workouts;
    return workouts.filter((item) => {
      const matchesSearch = item.workoutType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || item.workoutType === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [data.workouts, searchTerm, selectedFilter]);

  return (
    <div className="bg-background border-muted flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Table Container */}
      <div className="overflow-x-auto">
        {filteredData.length === 0 ? (
          <div className={`${typography.muted} flex flex-col items-center justify-center py-12`}>
            <Filter className="mb-2 h-12 w-12 opacity-20" />
            <p>No matching records found.</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className={`${typography.small} text-primary mt-2 hover:underline`}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <table className={`${typography.small} w-full text-left`}>
            <thead className="bg-muted/30 text-muted-foreground border-muted border-b">
              <tr>
                <th className={`${typography.mutedXs} px-6 py-3`}>Activity</th>
                <th className={`${typography.mutedXs} px-6 py-3`}>Date</th>
                <th className={`${typography.mutedXs} px-6 py-3`}>Stats</th>
                <th className={`${typography.mutedXs} px-6 py-3`}>Status</th>
                <th className={`${typography.mutedXs} px-6 py-3 text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-muted divide-y">
              {filteredData.map((workout) => (
                <ActivityListTile
                  key={workout.id}
                  workout={workout}
                  onClick={() => data.onEdit && data.onEdit(workout.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-muted/10 border-muted border-t px-6 py-3 text-center">
        <Button
          variant="ghost"
          size="sm"
          className={`${typography.labelXs} text-muted-foreground hover:text-primary transition-colors`}
        >
          Load More History
        </Button>
      </div>
    </div>
  );
}

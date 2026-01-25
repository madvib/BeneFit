import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import type { HistoryItem } from '../types';
import ActivityListTile from '../feed/activity-list-tile';
import { Button, EmptyState, typography } from '@/lib/components';

interface WorkoutListProps {
  workouts: HistoryItem[];
  loading?: boolean;
  onEdit?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  emptyMessage?: string;
}

export default function WorkoutList(data: Readonly<WorkoutListProps>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // TODO this should be a hook
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
      {/* List Container */}
      <div className="flex-1 overflow-y-auto">
        {filteredData.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No matching records found."
            description=""
            action={
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('all');
                }}
                className={`${typography.small} text-primary mt-2 hover:underline`}
              >
                Clear filters
              </Button>
            }
            iconClassName="opacity-20"
          />
        ) : (
          <div className="flex flex-col">
            {filteredData.map((item) => {
              // Ensure we only render completed workouts with the tile, or handle sessions differently
              // For now, based on user input, we assume the list is primarily for history/completed items.
              if ('recordedAt' in item) {
                 return (
                  <ActivityListTile
                    key={item.id}
                    workout={item}
                    onClick={() => data.onEdit && data.onEdit(item.id)}
                    onDelete={data.onDelete ? () => data.onDelete?.(item.id) : undefined}
                  />
                 );
              }
              // Fallback for sessions if they appear? Or maybe just don't render them here?
              // The user said "this will only ever be completed activity", implying the data source is filtered.
              // But strictly speaking, the type allows sessions.
              return null;
            })}
          </div>
        )}
      </div>
      <div className="bg-muted/10 border-muted border-t px-6 py-3 text-center">
      {/*TODO needs to load more*/ }
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

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import HistoryRow from './workout-list-tile';

export interface WorkoutData {
  id: string;
  date: string; // ISO string
  type: string;
  duration: string;
  calories: number;
  distance?: string;
  sets?: number;
  laps?: number;
  status?: 'completed' | 'in progress';
}

interface WorkoutListProps {
  workouts: WorkoutData[];
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
      const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [data.workouts, searchTerm, selectedFilter]);

  return (
    <div className="bg-background border-muted flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Table Container */}
      <div className="overflow-x-auto">
        {filteredData.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <Filter className="mb-2 h-12 w-12 opacity-20" />
            <p>No matching records found.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
              className="text-primary mt-2 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-muted-foreground border-muted border-b">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider uppercase">
                  Activity
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider uppercase">
                  Stats
                </th>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-muted divide-y">
              {filteredData.map((workout) => HistoryRow(workout))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-muted/10 border-muted border-t px-6 py-3 text-center">
        <button className="text-muted-foreground hover:text-primary text-xs font-medium transition-colors">
          Load More History
        </button>
      </div>
    </div>
  );
}

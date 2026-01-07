'use client';

import { X, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';

const HISTORY_ITEMS = [
  {
    id: '1',
    date: 'Today, 8:00 AM',
    workout: 'Morning Run',
    duration: '30 min',
    calories: '320 kcal',
    type: 'Cardio',
  },
  {
    id: '2',
    date: 'Yesterday, 6:30 PM',
    workout: 'Upper Body Power',
    duration: '45 min',
    calories: '210 kcal',
    type: 'Strength',
  },
  {
    id: '3',
    date: 'Oct 20, 2025',
    workout: 'Yoga Flow',
    duration: '60 min',
    calories: '150 kcal',
    type: 'Flexibility',
  },
];

interface WorkoutHistoryItem {
  id: string;
  date: string;
  workout: string;
  duration: string;
  calories: string;
  type: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workouts?: WorkoutHistoryItem[];
}

export default function HistoryModal({ isOpen, onClose, workouts }: HistoryModalProps) {
  if (!isOpen) return null;

  // Use provided workouts or fallback to hardcoded data
  const historyItems = workouts && workouts.length > 0 ? workouts : HISTORY_ITEMS;

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <div className="bg-background animate-in zoom-in-95 w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl duration-200">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-6">
          <h2 className="text-foreground text-2xl font-bold">Workout History</h2>
          <button
            onClick={onClose}
            className="bg-accent text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="group border-border bg-card hover:border-primary/30 flex items-center justify-between rounded-2xl border p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold">{item.workout}</h3>
                    <div className="text-muted-foreground flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden text-right sm:block">
                    <p className="text-foreground font-bold">{item.calories}</p>
                    <p className="text-muted-foreground text-xs">{item.type}</p>
                  </div>
                  <ChevronRight
                    size={20}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-accent/5 border-t p-6">
          <button className="bg-primary text-primary-foreground w-full rounded-xl py-3 font-bold transition-opacity hover:opacity-90">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

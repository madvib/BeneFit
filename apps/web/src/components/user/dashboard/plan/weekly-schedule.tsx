'use client';

import { Calendar, ChevronLeft, ChevronRight, Clock, Zap, PlayCircle, CheckCircle2 } from 'lucide-react';
import { WeeklyWorkoutPlan } from './types';
import { Card } from '@/components/common/ui-primitives/card/card';

interface WeeklyScheduleProps {
  weeklyWorkouts: WeeklyWorkoutPlan[];
  onWorkoutClick: (id: string) => void;
}

export default function WeeklySchedule({ weeklyWorkouts, onWorkoutClick }: WeeklyScheduleProps) {
  return (
    <Card
      title="Weekly Schedule"
      icon={Calendar}
      className="h-full border-border/50 bg-card shadow-sm"
      headerClassName="border-b border-border/50"
      headerAction={
        <div className="flex items-center gap-2">
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-foreground">Oct 23 - 29</span>
          <button className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
            <ChevronRight size={18} />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyWorkouts.map((workout) => (
          <div
            key={workout.id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-md ${
              workout.completed
                ? 'border-primary/20 bg-primary/5'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            {/* Day Header */}
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`text-sm font-bold ${
                  !workout.completed ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {workout.day}
              </span>
              {workout.completed && (
                <div className="rounded-full bg-primary/10 p-1 text-primary">
                  <CheckCircle2 size={14} />
                </div>
              )}
            </div>

            {/* Workout Info */}
            <div className="mb-4">
              <h4 className="mb-1 font-bold text-foreground">{workout.exercise}</h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {workout.duration || '45m'}
                </span>
                {workout.intensity && (
                  <span className="flex items-center gap-1">
                    <Zap size={12} />
                    {workout.intensity}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onWorkoutClick(workout.id)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-colors ${
                workout.completed
                  ? 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {workout.completed ? 'View Details' : 'Start Workout'}
              {!workout.completed && <PlayCircle size={14} />}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

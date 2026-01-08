'use client';

import { useState, useEffect } from 'react';
import { Button, Card } from '@/lib/components';
import { ChevronLeft, Square, CheckSquare, Timer } from 'lucide-react';

interface Activity {
  type: string;
  durationMinutes: number;
  instructions: string;
}

interface Workout {
  type: string;
  activities: Activity[];
}

interface SessionViewProps {
  workout: Workout;
  onComplete: () => void;
  onBack: () => void;
}

export default function SessionView({ workout, onComplete, onBack }: SessionViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedActivities, setCompletedActivities] = useState<number[]>([]);

  // Simple timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleActivity = (index: number) => {
    setCompletedActivities((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-3xl flex-col p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft size={20} />
          Back
        </Button>
        <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-full px-3 py-1 font-mono font-bold">
          <Timer size={16} />
          {formatTime(elapsedSeconds)}
        </div>
      </div>

      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold">{workout.type} Session</h1>
        <p className="text-muted-foreground">{workout.activities?.length} activities planned</p>
      </div>

      {/* Activities List */}
      <div className="mb-8 flex-1 space-y-4">
        {workout.activities?.map((activity, idx) => {
          const isCompleted = completedActivities.includes(idx);
          return (
            <div key={idx} onClick={() => toggleActivity(idx)} className="cursor-pointer">
              <Card
                className={`p-4 transition-colors ${
                  isCompleted ? 'bg-accent/50 border-primary/20' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    {isCompleted ? <CheckSquare size={24} /> : <Square size={24} />}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between">
                      <h3
                        className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}
                      >
                        {activity.type}
                      </h3>
                      <span className="text-muted-foreground font-mono text-sm">
                        {activity.durationMinutes}m
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{activity.instructions}</p>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="bg-background/80 sticky bottom-4 rounded-2xl border p-4 shadow-lg backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">
            Progress: {completedActivities.length}/{workout.activities?.length || 0}
          </span>
          <div className="bg-secondary h-2 w-1/2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${(completedActivities.length / (workout.activities?.length || 1)) * 100}%`,
              }}
            />
          </div>
        </div>
        <Button
          onClick={onComplete}
          className="w-full"
          size="lg"
          disabled={completedActivities.length === 0} // Optional constraint
        >
          Complete Workout
        </Button>
      </div>
    </div>
  );
}

'use client';

import { X, Calendar, Clock, Trophy, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-background shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Workout History</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-accent p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {HISTORY_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.workout}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-foreground">{item.calories}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-accent/5 p-6">
          <button className="w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground hover:opacity-90 transition-opacity">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

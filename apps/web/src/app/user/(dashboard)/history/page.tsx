'use client';

import { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import HistoryModal from '@/components/user/dashboard/history/history-modal';

export default function HistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-open modal for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setIsModalOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-accent/20 p-6 text-muted-foreground">
        <History size={48} />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Workout History</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        View your past workouts, achievements, and progress logs in detail.
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground transition-transform hover:scale-105"
      >
        Open History
      </button>

      <HistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

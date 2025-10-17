'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

type View = 'feed' | 'goal' | 'progress';

interface DashboardSubNavProps {
  onViewChange: (view: View) => void;
}

export default function DashboardSubNav({ onViewChange }: DashboardSubNavProps) {
  const [activeView, setActiveView] = useState<View>('feed');

  const handleViewChange = (view: View) => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <div className="flex justify-around p-2 bg-secondary rounded-lg shadow-md">
      <Button
        onClick={() => handleViewChange('feed')}
        className={`flex-1 ${activeView === 'feed' ? 'btn-primary' : 'btn-ghost'}`}
      >
        Feed
      </Button>
      <Button
        onClick={() => handleViewChange('goal')}
        className={`flex-1 ${activeView === 'goal' ? 'btn-primary' : 'btn-ghost'}`}
      >
        Goal
      </Button>
      <Button
        onClick={() => handleViewChange('progress')}
        className={`flex-1 ${activeView === 'progress' ? 'btn-primary' : 'btn-ghost'}`}
      >
        Progress
      </Button>
    </div>
  );
}

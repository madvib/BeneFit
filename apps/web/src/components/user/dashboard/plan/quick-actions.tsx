'use client';

import { Zap, Plus,  Share2, Download, Save } from 'lucide-react';
import { Card } from '@/components/common/ui-primitives/card/card';

interface QuickActionsProps {
  onCreatePlan: () => void;
  onSavePlan: () => void;
  onExportPlan: () => void;
}

export default function QuickActions({ onCreatePlan, onSavePlan, onExportPlan }: QuickActionsProps) {
  const actions = [
    {
      id: 'create',
      label: 'Create New',
      icon: <Plus size={20} />,
      color: 'text-primary',
      onClick: onCreatePlan,
    },
    {
      id: 'save',
      label: 'Save Plan',
      icon: <Save size={20} />,
      color: 'text-blue-500',
      onClick: onSavePlan,
    },
    {
      id: 'export',
      label: 'Export PDF',
      icon: <Download size={20} />,
      color: 'text-green-500',
      onClick: onExportPlan,
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 size={20} />,
      color: 'text-purple-500',
      onClick: () => console.log('Share'),
    },
  ];

  return (
    <Card
      title="Quick Actions"
      icon={Zap}
      className="border-border/50 bg-card shadow-sm"
      headerClassName="border-b border-border/50"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background p-4 transition-all hover:border-primary/50 hover:bg-accent/50 hover:shadow-sm active:scale-95"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-background group-hover:shadow-sm ${action.color}`}
            >
              {action.icon}
            </div>
            <span className="text-xs font-bold text-muted-foreground transition-colors group-hover:text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

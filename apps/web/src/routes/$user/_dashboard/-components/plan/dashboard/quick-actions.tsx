

import { Card, typography } from '@/lib/components';
import { Zap, Plus, Share2, Download, Save, Pause } from 'lucide-react';

interface QuickActionsProps {
  onCreatePlan: () => void;
  onSavePlan: () => void;
  onExportPlan: () => void;
  onPausePlan?: () => void;
  isLoading?: boolean;
}

export  function QuickActions({
  onCreatePlan,
  onSavePlan,
  onExportPlan,
  onPausePlan,
  isLoading,
}: Readonly<QuickActionsProps>) {
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
    ...(onPausePlan
      ? [
          {
            id: 'pause',
            label: 'Pause Plan',
            icon: <Pause size={20} />,
            color: 'text-yellow-500',
            onClick: onPausePlan,
          },
        ]
      : []),
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
            disabled={isLoading}
            className="group border-border bg-background hover:border-primary/50 hover:bg-accent/50 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all hover:shadow-sm active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            <div
              className={`bg-accent group-hover:bg-background flex h-10 w-10 items-center justify-center rounded-full transition-colors group-hover:shadow-sm ${action.color}`}
            >
              {action.icon}
            </div>
            <span
              className={`${typography.labelXs} text-muted-foreground group-hover:text-foreground transition-colors`}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

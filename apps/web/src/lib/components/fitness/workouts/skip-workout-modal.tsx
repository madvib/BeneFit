

import { Badge, Button, Modal, typography } from '@/lib/components';
import { AlertCircle, Clock, BrainCircuit, BatteryPlus, Activity } from 'lucide-react';

interface SkipWorkoutModalProps {
 readonly isOpen: boolean;
 readonly onClose: () => void;
 readonly onConfirm: (_reason: string) => void;
 readonly isLoading?: boolean;
}

const SKIP_REASONS = [
  {
    id: 'fatigue',
    title: 'High Fatigue',
    description: 'Central nervous system recovery required.',
    icon: BatteryPlus,
    color: 'text-orange-500',
  },
  {
    id: 'time',
    title: 'Scheduling Conflict',
    description: 'Protocol execution postponed due to time.',
    icon: Clock,
    color: 'text-blue-500',
  },
  {
    id: 'injury',
    title: 'Minor Discomfort',
    description: 'Joint or muscle integrity preservation.',
    icon: Activity,
    color: 'text-red-500',
  },
  {
    id: 'motivation',
    title: 'Low Cognitive Energy',
    description: 'Re-calibrating mental performance state.',
    icon: BrainCircuit,
    color: 'text-purple-500',
  },
];

export function SkipWorkoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SkipWorkoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Skip this Session?"
      description="Deviating from the plan may impact your long-term adaptation cycle."
      className="p-0"
    >
      <div className="relative overflow-hidden p-6 sm:p-10">
        {/* Background Accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-orange-500/5 to-transparent" />

        {/* Protocol Deviation Badge */}
        <div className="relative mb-6 flex items-center gap-2">
          <div className="rounded-xl bg-orange-500/20 p-2 text-orange-500">
            <AlertCircle size={18} />
          </div>
          <Badge
            variant="outline"
            className={`${typography.labelXs} bg-orange-500/10 text-orange-600`}
          >
            Protocol Deviation
          </Badge>
        </div>

        {/* Rationale Selection */}
        <div className="space-y-4">
          <p className={`${typography.labelXs} font-bold tracking-wider uppercase opacity-40`}>
            Select Rationale
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SKIP_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => onConfirm(reason.id)}
                className="group bg-accent/30 border-border/50 relative flex flex-col gap-2 rounded-2xl border p-5 text-left transition-all hover:border-orange-500/40 hover:bg-orange-500/5 active:scale-95 disabled:opacity-50"
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${reason.color} bg-background ring-border/20 rounded-lg p-2 shadow-sm ring-1 transition-transform group-hover:scale-110`}
                  >
                    <reason.icon size={16} />
                  </div>
                  <p className={`${typography.h4} italic`}>{reason.title}</p>
                </div>
                <p className={`${typography.mutedXs} leading-relaxed opacity-60`}>
                  {reason.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="default"
            size="lg"
            className="bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400"
            onClick={() => onConfirm('other')}
            isLoading={isLoading}
          >
            Confirm Skip
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground"
            onClick={onClose}
          >
            Negate & Execute Session
          </Button>
        </div>

        <div className="border-border/50 mt-8 border-t pt-6 text-center">
          <p className={`${typography.labelXs} opacity-30`}>
            BeneFit Intelligence • Tactical Planning System
          </p>
        </div>
      </div>
    </Modal>
  );
}

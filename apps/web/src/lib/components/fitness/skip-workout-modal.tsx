'use client';

import { X, AlertCircle, Clock, BrainCircuit, BatteryPlus, Activity } from 'lucide-react';
import { Button, Typography, Badge } from '@/lib/components';

interface SkipWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_reason: string) => void;
  isLoading?: boolean;
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

export default function SkipWorkoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: SkipWorkoutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md duration-300"
      onClick={onClose}
    >
      <div
        className="bg-background ring-border/50 animate-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-[32px] p-6 shadow-2xl ring-1 duration-500 sm:rounded-[40px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Accent */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-32 bg-linear-to-b from-orange-500/5 to-transparent" />

        {/* Header */}
        <div className="relative mb-6 flex items-start justify-between sm:mb-8">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-orange-500/20 p-2 text-orange-500">
                <AlertCircle size={18} />
              </div>
              <Badge
                variant="outline"
                className="bg-orange-500/10 text-[9px] font-black tracking-widest text-orange-600 uppercase"
              >
                Protocol Deviation
              </Badge>
            </div>
            <Typography
              variant="h2"
              className="text-2xl leading-none font-black tracking-tighter sm:text-3xl"
            >
              Skip this Session?
            </Typography>
            <Typography variant="muted" className="mt-2 text-xs font-bold opacity-70">
              Deviating from the plan may impact your long-term adaptation cycle.
            </Typography>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 h-10 w-10 rounded-full transition-all active:scale-90 sm:-mt-2 sm:-mr-2"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Rationale Selection */}
        <div className="mb-8 sm:mb-10">
          <Typography
            variant="muted"
            className="mb-4 text-[10px] font-black tracking-widest uppercase opacity-40"
          >
            Valid Rationale Required
          </Typography>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {SKIP_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => onConfirm(reason.id)}
                className="group bg-accent/30 border-border/50 relative rounded-2xl border p-4 text-left transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/5 active:scale-95 disabled:opacity-50 sm:p-5"
                disabled={isLoading}
              >
                <div className="mb-2 flex items-center gap-3 sm:mb-3">
                  <div
                    className={`${reason.color} bg-background ring-border/20 rounded-lg p-2 shadow-sm ring-1 transition-transform group-hover:scale-110`}
                  >
                    <reason.icon size={16} />
                  </div>
                  <Typography variant="small" className="text-sm font-black italic">
                    {reason.title}
                  </Typography>
                </div>
                <Typography
                  variant="muted"
                  className="text-[10px] leading-tight font-medium opacity-70"
                >
                  {reason.description}
                </Typography>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <Button
            variant="default"
            size="lg"
            className="h-12 w-full rounded-2xl bg-orange-600 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-orange-700 active:scale-95 sm:h-14 dark:bg-orange-500 dark:hover:bg-orange-400"
            onClick={() => onConfirm('other')}
            isLoading={isLoading}
          >
            Confirm Skip
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground hover:text-foreground h-12 w-full rounded-2xl text-[9px] font-black tracking-widest uppercase sm:h-14"
            onClick={onClose}
          >
            Negate & Execute Session
          </Button>
        </div>

        <div className="border-border/50 mt-6 border-t pt-4 text-center sm:mt-8 sm:pt-6">
          <Typography
            variant="muted"
            className="text-[9px] font-black tracking-widest uppercase opacity-30"
          >
            BeneFit Intelligence • Tactical Planning System
          </Typography>
        </div>
      </div>
    </div>
  );
}

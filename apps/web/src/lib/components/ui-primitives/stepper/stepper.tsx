'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Modal } from '@/lib/components/ui-primitives';

export interface StepperStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StepperProps {
  steps: readonly StepperStep[];
  currentStepIndex: number;
  direction: number;
  onClose?: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showProgress?: boolean;
  variant?: 'modal' | 'inline';
}

export function Stepper({
  steps,
  currentStepIndex,
  direction,
  onClose,
  children,
  footer,
  size = 'lg',
  showProgress = true,
  variant = 'modal',
}: StepperProps) {
  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const Icon = currentStep.icon;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  const content = (
    <div
      className={`flex flex-col ${variant === 'inline' ? 'bg-background overflow-hidden rounded-3xl border shadow-xl' : 'min-h-[500px]'}`}
    >
      {/* Progress Header */}
      <div className="bg-muted/30 border-b p-6 sm:p-8">
        <div className="font-outfit mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-primary/10 text-primary ring-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-xl leading-tight font-bold tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                {currentStep.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground text-sm font-semibold tracking-tighter">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
        </div>

        {showProgress && (
          <div className="bg-secondary/50 ring-primary/5 relative h-2 w-full overflow-hidden rounded-full ring-1">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-500 ease-out"
              style={{ width: `${(currentStepIndex / (steps.length - 1 || 1)) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Stepper Content */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 35 },
              opacity: { duration: 0.2 },
            }}
            className="h-full w-full p-6 sm:p-10"
          >
            <div className="mx-auto h-full max-w-2xl">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="bg-muted/10 border-t p-6 sm:p-8">{footer}</div>
    </div>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <Modal size={size} onClose={onClose || (() => {})}>
      {content}
    </Modal>
  );
}

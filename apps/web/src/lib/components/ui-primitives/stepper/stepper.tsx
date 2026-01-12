'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { ProgressBar, Card, typography } from '@/lib/components';
import { cardVariants } from '../card/card';

export interface StepperStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StepperProps extends VariantProps<typeof cardVariants> {
  steps: readonly StepperStep[];
  currentStepIndex: number;
  direction: number;
  onClose?: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showProgress?: boolean;
  className?: string;
}

export default function Stepper({
  steps,
  currentStepIndex,
  direction,
  children,
  footer,
  showProgress = true,
  variant = 'default',
  className,
}: StepperProps) {
  // eslint-disable-next-line security/detect-object-injection
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

  return (
    <Card
      variant={variant}
      className={className}
      bodyClassName="flex flex-col p-0 overflow-hidden"
      footer={footer}
    >
      {/* Progress Header */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-left">
            <div className="bg-primary/10 text-primary ring-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1">
              <Icon size={24} />
            </div>
            <div>
              <h2 className={`${typography.h4} font-bold`}>{currentStep.title}</h2>
              <p className={`${typography.muted} font-medium`}>{currentStep.description}</p>
            </div>
          </div>
          <div className="flex items-center sm:block">
            <span
              className={`${typography.small} text-primary bg-primary/10 sm:text-muted-foreground rounded-full px-3 py-1 font-black tracking-tighter sm:bg-transparent sm:p-0 sm:font-semibold`}
            >
              {currentStepIndex + 1}
              <span className="mx-0.5 opacity-50">/</span>
              {steps.length}
            </span>
          </div>
        </div>

        {showProgress && (
          <ProgressBar
            value={currentStepIndex}
            max={steps.length - 1 || 1}
            size="sm"
            className="mb-2"
          />
        )}
      </div>

      {/* Stepper Content */}
      <div className="relative flex-1">
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
            className="h-full w-full p-0 sm:px-10 sm:pb-10"
          >
            <div className="mx-auto h-full max-w-2xl">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}

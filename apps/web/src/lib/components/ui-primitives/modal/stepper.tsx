import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Modal, ProgressBar, typography } from '@/lib/components';


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
  className?: string;
  isRoute?: boolean;
  isOpen?: boolean;
  onCloseConfirm?: {
    title?: ReactNode;
    message?: ReactNode;
    confirmText?: string;
    cancelText?: string;
  };
}

export function Stepper({
  steps,
  currentStepIndex,
  direction,
  onClose,
  children,
  footer,
  showProgress = true,
  size,
  className,
  isRoute,
  isOpen,
  onCloseConfirm,
}: Readonly<StepperProps>) {
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
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      isRoute={isRoute}
      footer={footer}
      className={className}
      showCloseButton
      onCloseConfirm={onCloseConfirm}
      title={
        <div className="flex items-center gap-4 text-left">
          <div className="bg-primary/10 text-primary ring-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1">
            <Icon size={24} />
          </div>
          <div>
            <h2 className={`${typography.h4} font-bold`}>{currentStep.title}</h2>
            <p className={`${typography.muted} font-medium`}>{currentStep.description}</p>
          </div>
        </div>
      }
    >
      <div className="relative flex-1">
        {showProgress && (
          <ProgressBar
            value={currentStepIndex}
            max={steps.length - 1 || 1}
            size="sm"
            className="mb-6"
          />
        )}
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
            className="h-full w-full"
          >
            <div className="mx-auto h-full max-w-2xl">{children}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}

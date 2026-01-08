import React from 'react';
import { Button, Card } from '@/lib/components';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface WizardStepDef {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface WizardProps {
  steps: WizardStepDef[];
  currentStepIndex: number;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
  canGoNext?: boolean;
  children: React.ReactNode;
  title?: string;
}

export function Wizard({
  steps,
  currentStepIndex,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  isLoading = false,
  canGoNext = true,
  children,
  title,
}: WizardProps) {
  // eslint-disable-next-line security/detect-object-injection
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return null;
  }

  return (
    <div className="animate-in fade-in w-full max-w-xl space-y-8 duration-500">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="text-muted-foreground flex justify-between text-xs font-medium tracking-wider uppercase">
          <span>Start</span>
          <span>Finish</span>
        </div>
        <div className="bg-secondary relative h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="text-center">
        {currentStep.icon && (
          <div className="bg-primary/10 text-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full shadow-sm">
            <currentStep.icon size={24} />
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title || currentStep.title}</h1>
        <p className="text-muted-foreground mt-2">
          Step {currentStepIndex + 1} of {steps.length}: {currentStep.title}
        </p>
      </div>

      {/* Step Content */}
      <Card className="border-muted/60 relative min-h-[300px] overflow-hidden p-6 shadow-md">
        <div
          key={currentStep.id}
          className="animate-in fade-in slide-in-from-right-4 h-full duration-300"
        >
          {children}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isFirstStep || isLoading}
          type="button"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </Button>
        <Button
          onClick={onNext}
          isLoading={isLoading}
          disabled={!canGoNext}
          type="button"
          className="min-w-[140px]"
        >
          {isLastStep ? 'Complete Setup' : 'Next Step'}
          {isLastStep ? (
            <Check size={18} className="ml-2" />
          ) : (
            <ArrowRight size={18} className="ml-2" />
          )}
        </Button>
      </div>
    </div>
  );
}

'';

import { useState } from 'react';

export function useStepper(maxSteps: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === maxSteps - 1;

  const handleNext = () => {
    setDirection(1);
    setCurrentStepIndex((prev) => Math.min(maxSteps - 1, prev + 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return {
    currentStepIndex,
    direction,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack,
  };
}

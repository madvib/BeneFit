import type { Meta, StoryObj } from '@storybook/react';
import { Target, Dumbbell, Calendar, User, Sparkles } from 'lucide-react';
import Stepper, { type StepperStep } from './stepper';
import Button from '../buttons/button';
import React from 'react';

const meta: Meta<typeof Stepper> = {
  title: 'Primitives/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
  },
  render: function Render(args) {
    const [currentStepIndex, setCurrentStepIndex] = React.useState(args.currentStepIndex || 0);
    const [direction, setDirection] = React.useState(1);

    const handleNext = () => {
      setDirection(1);
      setCurrentStepIndex((prev) => Math.min(args.steps.length - 1, prev + 1));
    };

    const handleBack = () => {
      setDirection(-1);
      setCurrentStepIndex((prev) => Math.max(0, prev - 1));
    };

    const currentStep = args.steps[currentStepIndex];

    return (
      <div className="bg-card w-[600px] overflow-hidden rounded-3xl border shadow-2xl">
        <Stepper
          {...args}
          currentStepIndex={currentStepIndex}
          direction={direction}
          footer={
            <div className="flex w-full justify-between gap-4">
              <Button
                variant="ghost"
                className="rounded-xl px-8"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
              >
                Back
              </Button>
              <Button
                className="shadow-primary/20 rounded-xl px-12 font-bold shadow-lg"
                onClick={handleNext}
                disabled={currentStepIndex === args.steps.length - 1}
              >
                {currentStepIndex === args.steps.length - 1 ? 'Finish' : 'Continue'}
              </Button>
            </div>
          }
        >
          <div className="border-primary/20 bg-primary/5 flex min-h-[300px] flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed p-12 text-center">
            <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-2xl">
              {currentStep?.icon ? <currentStep.icon size={40} /> : <Target size={40} />}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentStep?.title || 'Step Content'}</h3>
              <p className="text-muted-foreground max-w-xs">
                {currentStep?.description || 'This description comes from the step metadata.'}
              </p>
            </div>
          </div>
        </Stepper>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const STEPS: readonly StepperStep[] = [
  {
    id: '1',
    title: 'Personal Info',
    description: 'Basic details and history',
    icon: User,
  },
  {
    id: '2',
    title: 'Training Goals',
    description: 'What do you want to achieve?',
    icon: Target,
  },
  {
    id: '3',
    title: 'Equipment',
    description: 'Tools you have access to',
    icon: Dumbbell,
  },
  {
    id: '4',
    title: 'Schedule',
    description: 'When can you work out?',
    icon: Calendar,
  },
  {
    id: '5',
    title: 'Confirmation',
    description: 'Review and generate',
    icon: Sparkles,
  },
] as const;

export const Default: Story = {
  args: {
    steps: STEPS,
    currentStepIndex: 0,
    direction: 1,
  },
};

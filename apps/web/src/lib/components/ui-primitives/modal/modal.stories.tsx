import { useState } from 'react';
import { Target, Dumbbell, Calendar, User, Sparkles } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, typography } from '@/lib/components';
import { Modal,ConfirmationModal,Stepper, type StepperStep } from './';


const meta: Meta<typeof Modal> = {
  title: 'Primitives/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const STEPS: readonly StepperStep[] = [
  { id: '1', title: 'Personal Info', description: 'Basic details', icon: User },
  { id: '2', title: 'Goals', description: 'What to achieve', icon: Target },
  { id: '3', title: 'Equipment', description: 'Tools available', icon: Dumbbell },
  { id: '4', title: 'Schedule', description: 'When to workout', icon: Calendar },
  { id: '5', title: 'Confirmation', description: 'Review', icon: Sparkles },
] as const;

const ModalShowcase = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="space-y-4">
      <h3 className={typography.h3}>Modal Variants</h3>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setActiveModal('small')}>Small Modal</Button>
        <Button onClick={() => setActiveModal('medium')}>Medium Modal</Button>
        <Button onClick={() => setActiveModal('large')}>Large Modal</Button>
        <Button onClick={() => setActiveModal('confirmation')}>Confirmation Modal</Button>
        <Button onClick={() => setActiveModal('stepper')}>Stepper Modal</Button>
      </div>

      {/* Small Modal */}
      <Modal
        isOpen={activeModal === 'small'}
        onClose={() => setActiveModal(null)}
        title="Small Modal"
        size="sm"
      >
        <div className="p-6">
          <p className={typography.p}>This is a small modal for quick interactions.</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setActiveModal(null)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Medium Modal */}
      <Modal
        isOpen={activeModal === 'medium'}
        onClose={() => setActiveModal(null)}
        title="Medium Modal"
        size="md"
      >
        <div className="p-6">
          <p className={typography.p}>This is a standard medium-sized modal.</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setActiveModal(null)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={activeModal === 'large'}
        onClose={() => setActiveModal(null)}
        title="Large Modal"
        size="lg"
      >
        <div className="p-6">
          <p className={typography.p}>This is a large modal with more space for content.</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setActiveModal(null)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={activeModal === 'confirmation'}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          console.log('Confirmed');
          setActiveModal(null);
        }}
        title="Are you sure?"
        message="This action cannot be undone."
      />

      {/* Stepper Modal */}
      <Stepper
        steps={STEPS}
        isOpen={activeModal === 'stepper'}
        onClose={() => {
          setActiveModal(null);
          setCurrentStepIndex(0);
        }}
        currentStepIndex={currentStepIndex}
        direction={direction}
        size="lg"
        footer={
          <div className="flex w-full justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setDirection(-1);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStepIndex === 0}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (currentStepIndex === STEPS.length - 1) {
                  setActiveModal(null);
                  setCurrentStepIndex(0);
                } else {
                  setDirection(1);
                  setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
                }
              }}
            >
              {currentStepIndex === STEPS.length - 1 ? 'Finish' : 'Continue'}
            </Button>
          </div>
        }
      >
        <div className="border-primary/20 bg-primary/5 flex min-h-75 flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed p-12 text-center">
          <div className="bg-primary/10 text-primary flex h-20 w-20 items-center justify-center rounded-2xl">
            {currentStep?.icon && <currentStep.icon size={40} />}
          </div>
          <div>
            <h3 className={typography.h3}>{currentStep?.title}</h3>
            <p className={`${typography.muted} max-w-xs`}>{currentStep?.description}</p>
          </div>
        </div>
      </Stepper>
    </div>
  );
};

export const Showcase: Story = {
  render: () => <ModalShowcase />,
};

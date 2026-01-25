import { Modal } from '@/lib/components';
import { getActivityTypeConfig } from '@/lib/constants/training-ui';
import type { CompletedWorkout } from '@bene/react-api-client';
import { CompletedWorkoutCard } from './completed-workout-card';
import { CompletedWorkoutDashboard } from './completed-workout-dashboard';
import { CompletedWorkoutModalContent } from './completed-workout-modal-content';

interface CompletedWorkoutViewProps {
  workout: CompletedWorkout;
  variant?: 'default' | 'modal' | 'card';
  isOpen?: boolean;
  onClose?: () => void;
}

export function CompletedWorkoutView({ 
  workout, 
  variant = 'default',
  isOpen,
  onClose
}: Readonly<CompletedWorkoutViewProps>) {
  if (!workout) {
    return null;
  }

  const typeConfig = getActivityTypeConfig(workout.workoutType);
  const Icon = typeConfig.icon;

  if (variant === 'card') {
    return (
      <CompletedWorkoutCard 
        workout={workout}
        Icon={Icon}
      />
    );
  }

  if (variant === 'modal') {
     const content = (
        <CompletedWorkoutModalContent 
           workout={workout}
           Icon={Icon}
           typeConfig={typeConfig}
        />
     );

     if (isOpen !== undefined && onClose !== undefined) {
        return (
           <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={true} className="p-0">
              <div className="no-scrollbar max-h-[85vh] overflow-y-auto">
                 {content}
              </div>
           </Modal>
        );
     }

     return content;
  }

  return (
    <CompletedWorkoutDashboard 
       workout={workout}
       Icon={Icon}
       typeConfig={typeConfig}
    />
  );
}

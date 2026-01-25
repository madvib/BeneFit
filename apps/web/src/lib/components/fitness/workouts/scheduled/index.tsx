import { Modal } from '@/lib/components';
import { getActivityTypeConfig } from '@/lib/constants/training-ui';
import type { DailyWorkout } from '@bene/react-api-client';
import { ScheduledWorkoutCard } from './scheduled-workout-card';
import { ScheduledWorkoutDashboard } from './scheduled-workout-dashboard';
import { ScheduledWorkoutModalContent } from './scheduled-workout-modal-content';

interface ScheduledWorkoutViewProps {
  workout: DailyWorkout;
  onStart?: () => void;
  onSkip?: () => void;
  layout?: 'dashboard' | 'modal' | 'inline' | 'card';
  isTemplate?: boolean;
  status?: 'scheduled' | 'completed' | 'skipped';
  subHeader?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ScheduledWorkoutView({ 
  workout, 
  onStart, 
  onSkip,
  layout = 'dashboard', 
  isTemplate = false,
  status = 'scheduled',
  subHeader,
  isOpen,
  onClose
}: Readonly<ScheduledWorkoutViewProps>) {
  if (!workout) {
    return null;
  }

  const typeConfig = getActivityTypeConfig(workout.type);
  const Icon = typeConfig.icon;

  if (layout === 'card' || layout === 'inline') {
    return (
      <ScheduledWorkoutCard 
        workout={workout}
        status={status}
        subHeader={subHeader}
        onStart={onStart}
        Icon={Icon}
        typeConfig={typeConfig}
        layout={layout}
      />
    );
  }

  if (layout === 'modal') {
     const content = (
        <ScheduledWorkoutModalContent 
           workout={workout}
           onStart={onStart}
           Icon={Icon}
           typeConfig={typeConfig}
           isTemplate={isTemplate}
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
    <ScheduledWorkoutDashboard 
       workout={workout}
       onStart={onStart}
       onSkip={onSkip}
       isTemplate={isTemplate}
       Icon={Icon}
       typeConfig={typeConfig}
    />
  );
}

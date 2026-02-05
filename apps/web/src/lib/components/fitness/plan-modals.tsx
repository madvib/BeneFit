import { GeneratePlanRequest } from '@bene/react-api-client';
import { PlanGenerationStepper } from '@/lib/components';
import { MODALS } from '@/lib/constants';

interface PlanModalsProps {
  activeModal?: string;
  onGenerate?: (_request: GeneratePlanRequest) => void;
  isLoading?: boolean;
}

// Custom event types
interface PlanGeneratedEventDetail {
  request: GeneratePlanRequest;
}

interface PlanGeneratedEvent extends CustomEvent {
  detail: PlanGeneratedEventDetail;
}

// Dispatch custom event when plan is generated
function dispatchPlanGeneratedEvent(request: GeneratePlanRequest) {
  const event = new CustomEvent('plan-generated', {
    detail: { request },
  }) as PlanGeneratedEvent;
  window.dispatchEvent(event);
}

export function PlanModals({
  activeModal,
  onGenerate,
  isLoading = false,
}: Readonly<PlanModalsProps>) {
  const handleGenerate = (request: GeneratePlanRequest) => {
    // Call the passed onGenerate if provided
    if (onGenerate) {
      onGenerate(request);
    } else {
      // Dispatch custom event for other components to listen to
      dispatchPlanGeneratedEvent(request);
    }
    // Close the modal after generation
  };

  return (
    <PlanGenerationStepper
      onGenerate={handleGenerate}
      isLoading={isLoading}
      isOpen={activeModal === MODALS.GENERATE_PLAN}
    />
  );
}

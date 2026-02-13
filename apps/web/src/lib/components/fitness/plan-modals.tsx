import { GeneratePlanRequest } from '@bene/react-api-client';
import { PlanGenerationStepper } from '@/lib/components';
import { MODALS } from '@/lib/constants';
import { useHydrated } from '@/lib/hooks/use-hydrated';

interface PlanModalsProps {
  activeModal?: string;
  onGenerate?: (_request: GeneratePlanRequest) => void;
  isLoading?: boolean;
}


export function PlanModals({
  activeModal,
  onGenerate,
  isLoading = false,
}: Readonly<PlanModalsProps>) {
  const isHydrated = useHydrated();

  const handleGenerate = (request: GeneratePlanRequest) => {
    // Call the passed onGenerate if provided
    if (onGenerate) {
      onGenerate(request);
    }
    // TODO Close the modal after generation
  };

  // Don't render until after hydration to prevent SSR/client mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <PlanGenerationStepper
      onGenerate={handleGenerate}
      isLoading={isLoading}
      isOpen={activeModal === MODALS.GENERATE_PLAN}
    />
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { OnboardingStepper, ProtectedRoute } from '@/lib/components';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
    <ProtectedRoute>
      <div className="bg-background-muted flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col">
          <OnboardingStepper />
        </main>
      </div>
    </ProtectedRoute>
  );
}

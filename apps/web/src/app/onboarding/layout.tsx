import { ProtectedRoute } from '@/lib/components/auth';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="bg-background-muted flex min-h-screen flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

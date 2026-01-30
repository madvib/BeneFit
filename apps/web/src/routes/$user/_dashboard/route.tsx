import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PageContainer, UnifiedHeader } from '@/lib/components';

export const Route = createFileRoute('/$user/_dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <PageContainer variant="fullViewport" className="flex h-screen flex-col">
      <UnifiedHeader variant="application" />
      <main className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col duration-700">
        <Outlet />
      </main>
    </PageContainer>
  );
}

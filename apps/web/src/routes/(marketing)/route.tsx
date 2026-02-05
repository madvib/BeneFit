import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Aurora, Footer, PageContainer, UnifiedHeader } from '@/lib/components';

export const Route = createFileRoute('/(marketing)')({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora blend={1} amplitude={0.8} speed={0.8} />
      </div>
      <UnifiedHeader variant="marketing" />
      <PageContainer variant="fullViewport">
        <main className="relative z-10 w-full grow">
          <Outlet />
        </main>
      </PageContainer>
      <Footer />
    </div>
  );
}

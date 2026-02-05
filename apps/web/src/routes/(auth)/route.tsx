import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PageContainer, UnifiedHeader } from '@/lib/components';

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <PageContainer variant={'noPadding'}>
      <UnifiedHeader variant="auth" />
      <div className="flex flex-1 flex-col">
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  );
}

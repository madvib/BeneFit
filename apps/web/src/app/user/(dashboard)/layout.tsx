import { PageContainer } from '@/components';
import UnifiedHeader from '@/components/common/header/unified-header';
import DashboardShell from '@/components/user/dashboard/layout/dashboard-shell';

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProperties) {
  return (
    <PageContainer className="flex h-screen flex-col pt-16">
      <UnifiedHeader variant="application" />
      <DashboardShell>{children}</DashboardShell>
    </PageContainer>
  );
}

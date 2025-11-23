import { PageContainer } from '@/components';
import UnifiedHeader from '@/components/common/header/unified-header';
import DashboardLayout from '@/components/user/dashboard/dashboard-layout';

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProperties) {
  return (
    <PageContainer className="flex min-h-screen flex-col">
      <UnifiedHeader variant="application" />
      <main className="w-full grow">
        <DashboardLayout>{children}</DashboardLayout>
      </main>
    </PageContainer>
  );
}

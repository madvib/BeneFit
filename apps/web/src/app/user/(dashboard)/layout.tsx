import { PageContainer } from '@/components';
import UnifiedHeader from '@/components/common/header/unified-header';

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProperties) {
  return (
    <PageContainer className="flex h-screen flex-col pt-16">
      <UnifiedHeader variant="application" />
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
    </PageContainer>
  );
}

import { PageContainer, UnifiedHeader } from '@/lib/components';

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: Readonly<UserLayoutProperties>) {
  return (
    <PageContainer variant="fullViewport" className="flex h-screen flex-col">
      <UnifiedHeader variant="application" />
      <main className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col duration-700">
        {children}
      </main>
    </PageContainer>
  );
}

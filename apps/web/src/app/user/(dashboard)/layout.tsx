import { PageContainer, Header } from '@/lib/components';

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProperties) {
  return (
    <PageContainer variant="fullViewport" className="flex h-screen flex-col">
      <Header variant="application" />
      <main className="animate-in fade-in slide-in-from-bottom-4 flex flex-1 flex-col duration-700">
        {children}
      </main>
    </PageContainer>
  );
}

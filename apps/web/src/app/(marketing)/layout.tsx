'use client';


import { Aurora, Footer, PageContainer, UnifiedHeader } from '@/lib/components';
interface MarketingLayoutProperties {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProperties) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora blend={1} amplitude={0.8} speed={0.8} />
      </div>
      <UnifiedHeader variant="marketing" />
      <PageContainer variant="fullViewport">
        <main className="relative z-10 w-full grow">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </PageContainer>
      <Footer />
    </div>
  );
}

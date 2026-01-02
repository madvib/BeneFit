'use client';

import { PageContainer, Header, Aurora, Footer } from '@/lib/components';

interface MarketingLayoutProperties {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProperties) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora blend={1.0} amplitude={0.8} speed={0.8} />
      </div>
      <Header variant="marketing" />
      <PageContainer className="flex min-h-screen flex-col">
        <main className="relative z-10 w-full grow">
          <div className="container mx-auto px-4 py-8">{children}</div>
        </main>
      </PageContainer>
      <Footer />
    </div>
  );
}

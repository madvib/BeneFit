'use client';

import { PageContainer } from '@/components';
import UnifiedHeader from '@/components/common/header/unified-header';
import Footer from '@/components/common/ui-primitives/footer/footer';

interface MarketingLayoutProperties {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProperties) {
  return (
    <PageContainer className="flex min-h-screen flex-col">
      <UnifiedHeader variant="marketing" />
      <main className="w-full grow">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </PageContainer>
  );
}

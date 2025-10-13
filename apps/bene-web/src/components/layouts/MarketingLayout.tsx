'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="marketing" />
      <main className="flex-grow container mx-auto p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
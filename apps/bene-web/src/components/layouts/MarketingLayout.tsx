'use client';

import Header from '@/components/header/Header';
import Footer from '@/components/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="marketing" />
      <main className="flex-grow w-full">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
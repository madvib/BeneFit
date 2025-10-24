"use client";

import Header from "@/presentation/header/Header/header";
import Footer from "@/presentation/footer";

interface MarketingLayoutProperties {
  children: React.ReactNode;
}

export default function MarketingLayout({
  children,
}: MarketingLayoutProperties) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="marketing" />
      <main className="flex-grow w-full">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

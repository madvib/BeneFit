'use client';

import { useState } from 'react';
import AccountHeader from './_shared/account-header';
import AccountSidebar from './_shared/account-sidebar';

interface AccountLayoutProperties {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProperties) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <AccountHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <AccountSidebar className="h-full" />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="bg-background/80 absolute inset-0 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="bg-background relative w-64 border-r shadow-xl">
              <AccountSidebar className="h-full" />
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

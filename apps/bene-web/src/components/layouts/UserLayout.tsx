'use client';

import Header from '@/components/header/Header';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="dashboard" />
      <main className="flex-grow w-full">
        <div className="py-4 md:py-6 px-4">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </main>
    </div>
  );
}
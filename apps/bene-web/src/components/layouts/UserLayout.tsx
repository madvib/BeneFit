'use client';

import Header from '@/components/Header';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="user" />
      <main className="flex-grow">
        <DashboardLayout>{children}</DashboardLayout>
      </main>
    </div>
  );
}
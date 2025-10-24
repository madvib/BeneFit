"use client";

import Header from "@/presentation/header/Header/header";
import DashboardLayout from "@/presentation/layouts/dashboard-layout";

interface UserLayoutProperties {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProperties) {
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

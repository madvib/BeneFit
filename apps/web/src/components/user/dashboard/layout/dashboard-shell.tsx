'use client';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* Main Content Area */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </main>
    </div>
  );
}

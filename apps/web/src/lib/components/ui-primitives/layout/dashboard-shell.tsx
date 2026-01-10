'use client';

interface DashboardShellProps {
  overview: React.ReactNode;
  schedule?: React.ReactNode;
  suggestions?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export default function DashboardShell({
  overview,
  schedule,
  suggestions,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-400 p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column (Main Content) - 8/12 width */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section className="w-full">{overview}</section>
          {schedule && <section className="w-full">{schedule}</section>}
          {children}
        </div>

        {/* Right Column (Sidebar) - 4/12 width */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 flex flex-col gap-8">
            <section>{actions}</section>
            {suggestions && <section>{suggestions}</section>}
          </div>
        </div>
      </div>
    </div>
  );
}

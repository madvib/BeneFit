interface DashboardShellProps {
  overview: React.ReactNode;
  schedule?: React.ReactNode;
  suggestions?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function DashboardShell({
  overview,
  schedule,
  suggestions,
  actions,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-400 p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Main Content) - 7/12 width */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <section className="w-full">{overview}</section>
          {schedule && <section className="w-full">{schedule}</section>}
          {children}
        </div>

        {/* Right Column (Sidebar) - 5/12 width */}
        <div className="min-w-0 lg:col-span-5">
          <div className="sticky top-24 flex min-w-0 flex-col gap-6">
            <section className="min-w-0">{actions}</section>
            {suggestions && <section className="min-w-0">{suggestions}</section>}
          </div>
        </div>
      </div>
    </div>
  );
}

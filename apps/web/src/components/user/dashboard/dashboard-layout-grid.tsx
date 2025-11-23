interface DashboardLayoutGridProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function DashboardLayoutGrid({ 
  children, 
  sidebar 
}: DashboardLayoutGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Main Content - Feed (Left 8 cols) */}
      <div className="lg:col-span-8">{children}</div>

      {/* Sidebar - Widgets (Right 4 cols) */}
      {sidebar && (
        <div className="lg:col-span-4">
          {sidebar}
        </div>
      )}
    </div>
  );
}
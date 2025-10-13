interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({ 
  children, 
  sidebar,
  className = '' 
}: DashboardLayoutProps) {
  return (
    <div className={`grid grid-cols-1 ${sidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-8 ${className}`}>
      {/* Main Content - takes full width if no sidebar, otherwise 3/4 */}
      <div className={sidebar ? "lg:col-span-3" : "lg:col-span-1"}>
        {children}
      </div>
      
      {/* Sidebar - takes 1/4 of the width when present */}
      {sidebar && (
        <div className="lg:col-span-1">
          {sidebar}
        </div>
      )}
    </div>
  );
}
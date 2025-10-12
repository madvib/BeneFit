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
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${className}`}>
      {/* Main Content - takes 3/4 of the width */}
      <div className="lg:col-span-3">
        {children}
      </div>
      
      {/* Sidebar - takes 1/4 of the width */}
      {sidebar && (
        <div className="lg:col-span-1">
          {sidebar}
        </div>
      )}
    </div>
  );
}
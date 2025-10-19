interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export default function DashboardLayout({
  children,
  sidebar,
  className = "",
}: DashboardLayoutProps) {
  return (
    <div className={`flex flex-col md:flex-row gap-4 md:gap-8 ${className}`}>
      {/* Main Content - takes full width on mobile, adjusts on desktop */}
      <div className={`flex-1 ${sidebar ? "md:order-1" : ""}`}>{children}</div>

      {/* Sidebar - appears below content on mobile, beside on desktop */}
      {sidebar && <div className="md:order-2 md:w-1/4 w-full">{sidebar}</div>}
    </div>
  );
}

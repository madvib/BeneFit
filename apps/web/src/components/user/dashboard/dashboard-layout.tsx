interface DashboardLayoutProperties {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
  sidebarPosition?: 'left' | 'right';
}

export default function DashboardLayout({
  children,
  sidebar,
  className = '',
  sidebarPosition = 'right',
}: DashboardLayoutProperties) {
  return (
    // CHANGED: md:flex-row -> lg:flex-row
    // The sidebar will now stay stacked at the bottom until the screen is large (1024px+)
    <div className={`flex flex-col gap-6 lg:flex-row lg:gap-8 ${className}`}>
      {/* Main Content */}
      {/* CHANGED: order logic to lg breakpoint */}
      <div
        className={`min-w-0 flex-1 ${
          sidebar
            ? sidebarPosition === 'right'
              ? 'lg:order-1'
              : 'lg:order-2'
            : ''
        }`}
      >
        {children}
      </div>

      {/* Sidebar */}
      {/* CHANGED: md:w-1/4 -> lg:w-80 (fixed width is usually better than % for sidebars) */}
      {sidebar && (
        <div
          className={`w-full shrink-0 lg:w-80 ${
            sidebarPosition === 'right' ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          <div className="sticky top-20">{sidebar}</div>
        </div>
      )}
    </div>
  );
}

interface PlanDashboardLayoutProps {
  planView: React.ReactNode;
  suggestionsView: React.ReactNode;
}

export default function PlanDashboardLayout({ 
  planView, 
  suggestionsView 
}: PlanDashboardLayoutProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-8 p-4 md:p-8 xl:grid-cols-3">
      {/* Main Content Area (66% width on XL) */}
      <div className="min-w-0 xl:col-span-2">{planView}</div>
      {/* Sidebar / Suggestions Panel (33% width on XL) */}
      <div className="xl:col-span-1">
        <div className="sticky top-24 space-y-6">{suggestionsView}</div>
      </div>
    </div>
  );
}
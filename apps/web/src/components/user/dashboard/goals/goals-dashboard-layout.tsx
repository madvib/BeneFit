interface GoalsDashboardLayoutProps {
  goalsView: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function GoalsDashboardLayout({ 
  goalsView, 
  sidebar 
}: GoalsDashboardLayoutProps) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">{goalsView}</div>
      <div className="space-y-6">{sidebar}</div>
    </div>
  );
}
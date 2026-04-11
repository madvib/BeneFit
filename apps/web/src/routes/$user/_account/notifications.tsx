import { createFileRoute } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { EmptyState, PageHeader } from '@/lib/components';

export const Route = createFileRoute('/$user/_account/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Choose how you receive updates and alerts"
        align="left"
      />

      <EmptyState
        icon={Bell}
        title="Coming soon"
        description="Notification preferences will be available once email delivery is configured."
        className="py-16"
      />
    </div>
  );
}

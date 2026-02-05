import { createFileRoute } from '@tanstack/react-router';
import { NotificationPreferences, PageHeader } from '@/lib/components';
import { useState } from 'react';

export const Route = createFileRoute('/$user/_account/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    marketing: false,
    community: true,
    workoutReminders: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Choose how you receive updates and alerts"
        align="left"
      />

      <NotificationPreferences
        emailNotifications={preferences.email}
        pushNotifications={preferences.push}
        workoutReminders={preferences.workoutReminders}
        onEmailNotificationsChange={() => handleToggle('email')}
        onPushNotificationsChange={() => handleToggle('push')}
        onWorkoutRemindersChange={() => handleToggle('workoutReminders')}
      />
    </div>
  );
}

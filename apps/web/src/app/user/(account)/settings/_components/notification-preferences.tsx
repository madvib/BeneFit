'use client';

import { FormSection, Checkbox } from '@/lib/components';

interface NotificationPreferencesProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workoutReminders: boolean;
  onEmailNotificationsChange: (_checked: boolean) => void;
  onPushNotificationsChange: (_checked: boolean) => void;
  onWorkoutRemindersChange: (_checked: boolean) => void;
}

export default function NotificationPreferences({
  emailNotifications,
  pushNotifications,
  workoutReminders,
  onEmailNotificationsChange,
  onPushNotificationsChange,
  onWorkoutRemindersChange,
}: NotificationPreferencesProps) {
  return (
    <FormSection title="Notification Preferences">
      <div className="space-y-4">
        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-muted-foreground text-sm">
              Receive email updates about your progress
            </p>
          </div>
          <Checkbox
            checked={emailNotifications}
            onChange={(e) => onEmailNotificationsChange(e.target.checked)}
          />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-muted-foreground text-sm">
              Receive push notifications on your devices
            </p>
          </div>
          <Checkbox
            checked={pushNotifications}
            onChange={(e) => onPushNotificationsChange(e.target.checked)}
          />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div>
            <p className="font-medium">Workout Reminders</p>
            <p className="text-muted-foreground text-sm">
              Get reminders to complete your workouts
            </p>
          </div>
          <Checkbox
            checked={workoutReminders}
            onChange={(e) => onWorkoutRemindersChange(e.target.checked)}
          />
        </div>
      </div>
    </FormSection>
  );
}

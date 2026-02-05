import { FormSection, Switch, typography } from '@/lib/components';
interface NotificationPreferencesProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workoutReminders: boolean;
  onEmailNotificationsChange: (_checked: boolean) => void;
  onPushNotificationsChange: (_checked: boolean) => void;
  onWorkoutRemindersChange: (_checked: boolean) => void;
}

export function NotificationPreferences({
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
          <div className="space-y-0.5">
            <p className={typography.h4}>Email Notifications</p>
            <p className={`${typography.p} text-muted-foreground block text-sm`}>
              Receive email updates about your progress
            </p>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={onEmailNotificationsChange} />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <p className={typography.h4}>Push Notifications</p>
            <p className={`${typography.p} text-muted-foreground block text-sm`}>
              Receive push notifications on your devices
            </p>
          </div>
          <Switch checked={pushNotifications} onCheckedChange={onPushNotificationsChange} />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <p className={typography.h4}>Workout Reminders</p>
            <p className={`${typography.p} text-muted-foreground block text-sm`}>
              Get reminders to complete your workouts
            </p>
          </div>
          <Switch checked={workoutReminders} onCheckedChange={onWorkoutRemindersChange} />
        </div>
      </div>
    </FormSection>
  );
}

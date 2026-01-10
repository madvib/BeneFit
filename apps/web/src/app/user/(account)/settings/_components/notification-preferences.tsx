import { FormSection, Switch } from '@/lib/components';
import Typography from '@/lib/components/ui-primitives/typography/typography';

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
          <div className="space-y-0.5">
            <Typography variant="large" className="text-base font-medium">
              Email Notifications
            </Typography>
            <Typography variant="small" className="text-muted-foreground block">
              Receive email updates about your progress
            </Typography>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={onEmailNotificationsChange} />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <Typography variant="large" className="text-base font-medium">
              Push Notifications
            </Typography>
            <Typography variant="small" className="text-muted-foreground block">
              Receive push notifications on your devices
            </Typography>
          </div>
          <Switch checked={pushNotifications} onCheckedChange={onPushNotificationsChange} />
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <Typography variant="large" className="text-base font-medium">
              Workout Reminders
            </Typography>
            <Typography variant="small" className="text-muted-foreground block">
              Get reminders to complete your workouts
            </Typography>
          </div>
          <Switch checked={workoutReminders} onCheckedChange={onWorkoutRemindersChange} />
        </div>
      </div>
    </FormSection>
  );
}

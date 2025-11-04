'use client';

import { Card } from '@/components';

interface NotificationPreferencesProps {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workoutReminders: boolean;
  onEmailNotificationsChange: (checked: boolean) => void;
  onPushNotificationsChange: (checked: boolean) => void;
  onWorkoutRemindersChange: (checked: boolean) => void;
}

export default function NotificationPreferences({ 
  emailNotifications, 
  pushNotifications, 
  workoutReminders,
  onEmailNotificationsChange,
  onPushNotificationsChange,
  onWorkoutRemindersChange
}: NotificationPreferencesProps) {
  return (
    <Card>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your progress
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emailNotifications}
                onChange={(e) => onEmailNotificationsChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={pushNotifications}
                onChange={(e) => onPushNotificationsChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium">Workout Reminders</p>
              <p className="text-sm text-muted-foreground">
                Get reminders to complete your workouts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={workoutReminders}
                onChange={(e) => onWorkoutRemindersChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
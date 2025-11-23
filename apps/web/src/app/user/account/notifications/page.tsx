'use client';

import { Bell, Mail, MessageSquare } from 'lucide-react';
import { Switch } from '@/components/common/ui-primitives/switch/switch';
import { useState } from 'react';
import { PageHeader } from '@/components/user/account/shared/page-header';
import { SettingRow } from '@/components/user/account/shared/setting-row';

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    marketing: false,
    community: true,
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Choose how you receive updates and alerts"
      />

      <div className="space-y-6">
        <SettingRow
          icon={Mail}
          title="Email Notifications"
          description="Receive daily summaries and important alerts via email"
          action={
            <Switch
              checked={preferences.email}
              onCheckedChange={() => toggle('email')}
            />
          }
        />

        <div className="border-muted my-4 border-t" />

        <SettingRow
          icon={Bell}
          title="Push Notifications"
          description="Get real-time updates on your device"
          action={
            <Switch checked={preferences.push} onCheckedChange={() => toggle('push')} />
          }
        />

        <div className="border-muted my-4 border-t" />

        <SettingRow
          icon={MessageSquare}
          title="Community Updates"
          description="Notifications about comments and likes on your posts"
          action={
            <Switch
              checked={preferences.community}
              onCheckedChange={() => toggle('community')}
            />
          }
        />
      </div>
    </div>
  );
}

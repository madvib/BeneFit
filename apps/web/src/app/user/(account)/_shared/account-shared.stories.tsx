import type { Meta, StoryObj } from '@storybook/react';
import AccountHeader from './account-header';
import AccountSidebar from './account-sidebar';
import { SettingRow } from './setting-row';
import { Bell, Lock, Mail, User } from 'lucide-react';
import { Button, PageHeader, Switch, typography } from '@/lib/components';

const meta: Meta = {
  title: 'Features/Account/Shared',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Header: StoryObj<typeof AccountHeader> = {
  render: () => <AccountHeader onOpenMobileMenu={() => console.log('Mobile menu opened')} />,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Sidebar: StoryObj<typeof AccountSidebar> = {
  render: () => (
    <div className="flex h-screen">
      <div className="w-64">
        <AccountSidebar />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const PageHeaders: StoryObj<typeof PageHeader> = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>With Description</p>
        <PageHeader
          title="Account Settings"
          description="Manage your account preferences and settings"
        />
      </div>

      <div className="border-t pt-8">
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>With Description</p>
        <PageHeader
          title="Profile"
          description="Manage your public profile and personal information"
        />
      </div>

      <div className="border-t pt-8">
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>Title Only</p>
        <PageHeader title="Security" />
      </div>
    </div>
  ),
};

export const SettingRows: StoryObj<typeof SettingRow> = {
  render: () => (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>Basic (No Action)</p>
        <SettingRow
          icon={User}
          title="Profile Information"
          description="Update your personal details"
        />
      </div>

      <div className="border-t pt-8">
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>With Toggle Switch</p>
        <SettingRow
          icon={Bell}
          title="Push Notifications"
          description="Receive notifications on your device"
          action={<Switch defaultChecked />}
        />
      </div>

      <div className="border-t pt-8">
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>With Button</p>
        <SettingRow
          icon={Mail}
          title="Email Preferences"
          description="Control which emails you receive from us"
          action={<Button size="sm">Manage</Button>}
        />
      </div>

      <div className="border-t pt-8">
        <p className={`${typography.labelXs} text-muted-foreground mb-3`}>With Outline Button</p>
        <SettingRow
          icon={Lock}
          title="Change Password"
          description="Update your password to keep your account secure"
          action={
            <Button variant="outline" size="sm">
              Change
            </Button>
          }
        />
      </div>
    </div>
  ),
};

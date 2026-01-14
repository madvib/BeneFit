import type { Meta, StoryObj } from '@storybook/react';
import { ListTile } from './list-tile';
import { Bell, Mail, Settings, ChevronRight } from 'lucide-react';
import { Switch, Button, Badge  } from '../';
import { typography } from '../../';

const meta: Meta<typeof ListTile> = {
  title: 'Primitives/ListTile',
  component: ListTile,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Showcase: StoryObj<typeof ListTile> = {
  render: () => (
    <div className="bg-background w-[500px] space-y-6 rounded-xl border p-6">
      <div className="space-y-4">
        <h3 className={`${typography.labelSm} text-muted-foreground`}>
          Default
        </h3>
        <ListTile
          title="Account Settings"
          description="Manage your account preferences"
          icon={Settings}
        />
      </div>

      <div className="space-y-4">
        <h3 className={`${typography.labelSm} text-muted-foreground`}>
          With Actions
        </h3>
        <div className="space-y-2">
          <ListTile
            title="Push Notifications"
            description="Receive real-time alerts"
            icon={Bell}
            action={<Switch defaultChecked />}
          />
          <div className="bg-muted h-px w-full" />
          <ListTile
            title="Connect Account"
            description="Link your Google account"
            icon={Mail}
            action={
              <Button variant="outline" size="sm">
                Connect
              </Button>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`${typography.labelSm} text-muted-foreground`}>
          Navigation
        </h3>
        <ListTile
          title="Profile Information"
          description="Update your personal details"
          action={<ChevronRight className="text-muted-foreground" size={20} />}
        />
      </div>

      <div className="space-y-4">
        <h3 className={`${typography.labelSm} text-muted-foreground`}>
          Status / Info
        </h3>
        <ListTile
          title="App Version"
          description="Current installed version"
          action={<Badge variant="active">v1.2.0</Badge>}
        />
      </div>
    </div>
  ),
};

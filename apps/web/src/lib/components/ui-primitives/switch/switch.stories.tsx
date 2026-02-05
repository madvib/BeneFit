import type { Meta, StoryObj } from '@storybook/react';
import { typography } from '@/lib/components';
import {Switch} from './switch';
import {Label} from '../form/label';
const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Showcase: Story = {
  render: () => (
    <div className="space-y-12">
      <div className="flex flex-col gap-8">
        <h3 className={typography.h3}>Switch States</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <p className={typography.small}>Default</p>
            <Switch />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={typography.small}>Checked</p>
            <Switch checked />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={typography.small}>Disabled</p>
            <Switch disabled />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className={typography.small}>Disabled Checked</p>
            <Switch disabled checked />
          </div>
        </div>
      </div>

      <div className="flex w-[400px] flex-col space-y-8 rounded-xl border p-6 shadow-sm">
        <div className="space-y-4">
          <h3 className={typography.h3}>Settings Example</h3>
          <p className={typography.muted}>Manage your application preferences.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className={`${typography.small} text-muted-foreground block`}>
                Receive alerts about your workout progress.
              </p>
            </div>
            <Switch id="notifications" />
          </div>

          <div className="bg-border h-px" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing emails</Label>
              <p className={`${typography.small} text-muted-foreground block`}>
                Receive emails about new features and offers.
              </p>
            </div>
            <Switch id="marketing" checked />
          </div>

          <div className="bg-border h-px" />

          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label htmlFor="sync">Strict Syncing</Label>
              <p className={`${typography.small} text-muted-foreground block`}>
                Automatically sync data after every session.
              </p>
            </div>
            <Switch id="sync" disabled />
          </div>
        </div>
      </div>
    </div>
  ),
};

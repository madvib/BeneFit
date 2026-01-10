import type { Meta, StoryObj } from '@storybook/react';
import Switch from './switch';
import Label from '../form/label';
import Typography from '../typography/typography';

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
        <Typography variant="h3">Switch States</Typography>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Typography variant="small">Default</Typography>
            <Switch />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Typography variant="small">Checked</Typography>
            <Switch checked />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Typography variant="small">Disabled</Typography>
            <Switch disabled />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Typography variant="small">Disabled Checked</Typography>
            <Switch disabled checked />
          </div>
        </div>
      </div>

      <div className="flex w-[400px] flex-col space-y-8 rounded-xl border p-6 shadow-sm">
        <div className="space-y-4">
          <Typography variant="h3">Settings Example</Typography>
          <Typography variant="muted">Manage your application preferences.</Typography>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">
                Notifications
              </Label>
              <Typography variant="small" className="text-muted-foreground block">
                Receive alerts about your workout progress.
              </Typography>
            </div>
            <Switch id="notifications" />
          </div>

          <div className="bg-border h-px" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing" className="text-base">
                Marketing emails
              </Label>
              <Typography variant="small" className="text-muted-foreground block">
                Receive emails about new features and offers.
              </Typography>
            </div>
            <Switch id="marketing" checked />
          </div>

          <div className="bg-border h-px" />

          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-0.5">
              <Label htmlFor="sync" className="text-base">
                Strict Syncing
              </Label>
              <Typography variant="small" className="text-muted-foreground block">
                Automatically sync data after every session.
              </Typography>
            </div>
            <Switch id="sync" disabled />
          </div>
        </div>
      </div>
    </div>
  ),
};

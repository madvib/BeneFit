import type { Meta, StoryObj } from '@storybook/react';
import Alert from './alert';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Showcase: Story = {
  render: () => (
    <div className="flex w-[500px] flex-col gap-6 p-8">
      <Alert
        title="Information"
        description="Your sync will resume automatically once the connection is stable."
        variant="info"
      />
      <Alert
        title="Sync Successful"
        description="All your latest activities have been pulled from Garmin Connect."
        variant="success"
      />
      <Alert
        title="Connection Warning"
        description="Your Strava token is expiring soon. Please re-authenticate."
        variant="warning"
      />
      <Alert
        title="API Error"
        description="We couldn't reach the coaching engine. Using cached insights."
        variant="error"
      />

      <div className="bg-muted/10 space-y-4 rounded-2xl border border-dashed p-6">
        <h4 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          In-Context Usage
        </h4>
        <Alert title="Account Verified" variant="success" onClose={() => console.log('closed')} />
      </div>
    </div>
  ),
};

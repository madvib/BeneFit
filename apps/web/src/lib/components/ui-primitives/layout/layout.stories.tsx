import type { Meta, StoryObj } from '@storybook/react';
import PageContainer from './page-container';
import TopTabNavigation from './top-tab-navigation';
import DashboardShell from './dashboard-shell';
import { Card, Typography } from '@/lib/components';
import { Activity, Calendar, Zap, TrendingUp } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Layout',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Container: StoryObj<typeof PageContainer> = {
  render: () => (
    <div className="bg-muted/10 h-screen w-full">
      <PageContainer variant="default">
        <div className="bg-background border-primary/20 mt-8 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed shadow-xl">
          <Typography variant="h2">Page Container</Typography>
          <Typography variant="muted">
            Content is constrained to a readable width with safe horizontal padding.
          </Typography>
        </div>
      </PageContainer>
    </div>
  ),
};

export const Dashboard: StoryObj<typeof DashboardShell> = {
  render: () => (
    <div className="bg-muted/10 min-h-screen w-full">
      <DashboardShell
        overview={
          <div className="space-y-4">
            <Typography variant="h2">Dashboard Overview</Typography>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card title="Latest Activity" icon={Activity} className="h-32">
                Activity Chart Workspace
              </Card>
              <Card title="Energy Levels" icon={Zap} className="h-32">
                Energy Trend Workspace
              </Card>
            </div>
          </div>
        }
        actions={
          <div className="space-y-4">
            <Card title="Quick Actions" className="bg-primary/5 border-primary/10">
              <div className="flex flex-col gap-2">
                <div className="bg-primary text-primary-foreground rounded-xl px-4 py-2 text-center text-sm font-bold">
                  Start Session
                </div>
                <div className="bg-background rounded-xl border px-4 py-2 text-center text-sm font-bold">
                  Log Manual Activity
                </div>
              </div>
            </Card>
            <Card title="Metrics" icon={TrendingUp}>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vo2 Max</span>
                  <span className="font-bold">54.2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recovery</span>
                  <span className="font-bold">82%</span>
                </div>
              </div>
            </Card>
          </div>
        }
      >
        <Card title="Upcoming Schedule" icon={Calendar} className="min-h-[300px]">
          Schedule Content Area
        </Card>
      </DashboardShell>
    </div>
  ),
};

export const Tabs: StoryObj<typeof TopTabNavigation> = {
  render: () => (
    <div className="mx-auto mt-12 max-w-2xl">
      <TopTabNavigation
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'settings', label: 'Settings' },
        ]}
      >
        {{
          overview: (
            <Card className="min-h-[200px]">
              <Typography variant="h3">Overview Content</Typography>
              <Typography variant="p">Welcome to your dashboard overview.</Typography>
            </Card>
          ),
          analytics: (
            <Card className="min-h-[200px]">
              <Typography variant="h3">Analytics Engine</Typography>
              <Typography variant="p">Deeper insights into your fitness trends.</Typography>
            </Card>
          ),
          settings: (
            <Card className="min-h-[200px]">
              <Typography variant="h3">Layout Settings</Typography>
              <Typography variant="p">Configure how your layout is structured.</Typography>
            </Card>
          ),
        }}
      </TopTabNavigation>
    </div>
  ),
};

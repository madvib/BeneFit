import { Activity, Calendar, Zap, TrendingUp } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, typography } from '@/lib/components';
import { PageContainer } from './page-container';
import { TopTabNavigation } from './top-tab-navigation';
import { DashboardShell } from './dashboard-shell';

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
        <div className="bg-background border-primary/20 mt-8 flex min-h-100 flex-col items-center justify-center rounded-3xl border border-dashed shadow-xl">
          <h2 className={typography.h2}>Page Container</h2>
          <p className={typography.muted}>
            Content is constrained to a readable width with safe horizontal padding.
          </p>
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
            <h2 className={typography.h2}>Dashboard Overview</h2>
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
                <div
                  className={`${typography.labelSm} bg-primary text-primary-foreground rounded-xl px-4 py-2 text-center`}
                >
                  Start Session
                </div>
                <div
                  className={`${typography.labelSm} bg-background rounded-xl border px-4 py-2 text-center`}
                >
                  Log Manual Activity
                </div>
              </div>
            </Card>
            <Card title="Metrics" icon={TrendingUp}>
              <div className="space-y-2">
                <div className={`${typography.p} flex justify-between`}>
                  <span>Vo2 Max</span>
                  <span className={`${typography.h4} italic`}>54.2</span>
                </div>
                <div className={`${typography.p} flex justify-between`}>
                  <span>Recovery</span>
                  <span className={`${typography.h4} italic`}>82%</span>
                </div>
              </div>
            </Card>
          </div>
        }
      >
        <Card title="Upcoming Schedule" icon={Calendar} className="min-h-75">
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
            <Card className="min-h-50">
              <h3 className={typography.h3}>Overview Content</h3>
              <p className={typography.p}>Welcome to your dashboard overview.</p>
            </Card>
          ),
          analytics: (
            <Card className="min-h-50">
              <h3 className={typography.h3}>Analytics Engine</h3>
              <p className={typography.p}>Deeper insights into your fitness trends.</p>
            </Card>
          ),
          settings: (
            <Card className="min-h-50">
              <h3 className={typography.h3}>Layout Settings</h3>
              <p className={typography.p}>Configure how your layout is structured.</p>
            </Card>
          ),
        }}
      </TopTabNavigation>
    </div>
  ),
};

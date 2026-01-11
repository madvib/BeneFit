import type { Meta, StoryObj } from '@storybook/react';
import { Badge, MetricPill, Typography } from '../';
import { ShieldCheck, AlertCircle, Info, Star, Zap, Flame, Timer } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Badges & Pills',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      {/* Badge Variants */}
      <section className="space-y-4">
        <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
          Badge Variants
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="primaryLight">Primary Light</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="active">Active</Badge>
          <Badge variant="inactive">Inactive</Badge>
          <Badge variant="ai">AI System</Badge>
        </div>
      </section>

      {/* Badges with Icons */}
      <section className="space-y-4">
        <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
          Badges with Icons
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Badge variant="success" icon={ShieldCheck}>
            Verified
          </Badge>
          <Badge variant="warning" icon={AlertCircle}>
            Warning
          </Badge>
          <Badge variant="info" icon={Info}>
            Information
          </Badge>
          <Badge variant="accent" icon={Star}>
            Featured
          </Badge>
          <Badge variant="ai">AI Accelerated</Badge>
        </div>
      </section>

      {/* Metric Pills */}
      <section className="space-y-4">
        <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
          Metric Pills (Performance)
        </Typography>
        <div className="flex flex-wrap gap-4">
          <MetricPill value="120" unit="bpm" icon={Zap} />
          <MetricPill value="450" unit="kcal" icon={Flame} variant="accent" />
          <MetricPill value="45" unit="min" icon={Timer} />
          <MetricPill value="12" unit="km" variant="accent" />
          <MetricPill value="98" unit="%" icon={ShieldCheck} />
        </div>
      </section>

      {/* Combinations */}
      <section className="space-y-4">
        <Typography variant="muted" className="text-xs font-bold tracking-widest uppercase">
          Usage Context
        </Typography>
        <div className="bg-background flex max-w-md items-center justify-between rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Typography variant="large" className="font-bold">
                  John Doe
                </Typography>
                <Badge variant="primaryLight" className="px-1.5 text-[10px]">
                  PRO
                </Badge>
              </div>
              <Typography variant="muted" className="text-xs">
                Active for 12 days
              </Typography>
            </div>
          </div>
          <MetricPill value="92" unit="%" variant="accent" />
        </div>
      </section>
    </div>
  ),
};

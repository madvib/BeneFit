import type { Meta, StoryObj } from '@storybook/react';
import { Badge, MetricPill } from '../';
import { typography } from '../../';
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
        <p className={typography.labelXs}>Badge Variants</p>
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
        <p className={typography.labelXs}>Badges with Icons</p>
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
        <p className={typography.labelXs}>Metric Pills (Performance)</p>
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
        <p className={typography.labelXs}>Usage Context</p>
        <div className="bg-background flex max-w-md items-center justify-between rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`${typography.labelXs} bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full`}
            >
              JD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={typography.h4}>John Doe</p>
                <Badge variant="primaryLight" className={`${typography.labelXs} px-1.5`}>
                  PRO
                </Badge>
              </div>
              <p className={typography.mutedXs}>Active for 12 days</p>
            </div>
          </div>
          <MetricPill value="92" unit="%" variant="accent" />
        </div>
      </section>
    </div>
  ),
};

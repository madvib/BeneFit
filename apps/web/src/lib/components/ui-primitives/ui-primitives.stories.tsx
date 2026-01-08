import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Badge, Alert } from '@/lib/components';
import SpotlightCard from './card/spotlight-card';
import ImageCard from './card/image-card';
import { MetricPill } from './badges/metric-pill';
import {
  Mail,
  Trash,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Flame,
  Timer,
} from 'lucide-react';

const meta: Meta = {
  title: 'Components/Primitives/Library',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Buttons: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <Mail size={16} />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button disabled>Disabled</Button>
        <Button isLoading>Loading</Button>
        <Button variant="outline" isLoading>
          Loading Outline
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button>
          <Mail className="mr-2 h-4 w-4" /> Login with Email
        </Button>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge className="bg-blue-500 hover:bg-blue-600">Custom Color</Badge>
    </div>
  ),
};

export const Alerts: StoryObj = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <Alert variant="default">
        <Info className="h-4 w-4" />
        <div className="ml-2">
          <h5 className="mb-1 leading-none font-medium">Information</h5>
          <div className="text-sm opacity-90">This is a standard alert message.</div>
        </div>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <div className="ml-2">
          <h5 className="mb-1 leading-none font-medium">Error</h5>
          <div className="text-sm opacity-90">Something went wrong! Please try again.</div>
        </div>
      </Alert>
      <div className="flex gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-700 dark:text-green-400">
        <CheckCircle className="h-5 w-5" />
        <div>
          <h5 className="font-medium">Success (Custom)</h5>
          <p className="text-sm">Action completed successfully.</p>
        </div>
      </div>
    </div>
  ),
};

export const Cards: StoryObj = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card title="Standard Card" className="h-40">
        <p className="text-muted-foreground">This is a basic card content area.</p>
      </Card>

      <Card
        title="Card with Icon"
        icon={Trophy}
        description="Optional description text goes here"
      >
        <div className="space-y-2">
          <div className="bg-muted h-2 w-full rounded" />
          <div className="bg-muted h-2 w-3/4 rounded" />
          <div className="bg-muted h-2 w-1/2 rounded" />
        </div>
      </Card>

      <Card
        title="Interactive Header"
        headerAction={
          <Button size="sm" variant="outline">
            Action
          </Button>
        }
      >
        <p className="text-muted-foreground">Card with a header action button.</p>
      </Card>
    </div>
  ),
};

export const SpotlightCardEffect: StoryObj<typeof SpotlightCard> = {
  render: () => (
    <div className="max-w-md rounded-3xl bg-black/5 p-4">
      <SpotlightCard>
        <div className="relative z-10 text-center">
          <h3 className="mb-2 text-xl font-bold">Spotlight Effect</h3>
          <p className="text-muted-foreground">
            Hover over this card to see the radial gradient tracking your mouse cursor. It uses
            `framer-motion` style interactions without the heavy library.
          </p>
        </div>
      </SpotlightCard>
    </div>
  ),
};

export const MetricPills: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <MetricPill value="120" unit="bpm" icon={Zap} />
        <MetricPill value="450" unit="kcal" icon={Flame} variant="accent" />
        <MetricPill value="45" unit="min" icon={Timer} />
      </div>
    </div>
  ),
};

export const ImageCards: StoryObj = {
  render: () => (
    <div className="max-w-md">
      <ImageCard
        src="https://picsum.photos/id/237/600/400"
        alt="Demo Image"
        width={600}
        height={400}
      />
    </div>
  ),
};

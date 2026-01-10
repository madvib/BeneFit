import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  Typography,
  Aurora,
  ShinyText,
  ElectricBorder,
  CountUp,
  Badge,
  PageContainer,
} from '../';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Brand/Showcase',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section with Aurora */}
      <section className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black">
        <Aurora colorStops={['#3b82f6', '#8b5cf6', '#d946ef']} speed={0.3} />
        <div className="relative z-10 space-y-6 px-6 text-center">
          <Badge
            variant="accent"
            className="border-white/20 bg-white/10 text-white backdrop-blur-md"
          >
            Premium Assets
          </Badge>
          <Typography
            variant="h1"
            className="text-5xl font-bold tracking-tighter text-white md:text-7xl"
          >
            Elevate the <ShinyText text="Fitness Experience" speed={3} />
          </Typography>
          <Typography variant="lead" className="mx-auto max-w-2xl text-white/60">
            Our brand system combines dynamic motion, electric accents, and glassy surfaces to
            create a premium, state-of-the-art interface.
          </Typography>
        </div>
      </section>

      <PageContainer className="space-y-16">
        {/* Electric Border Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            <Typography variant="h3">Electric Borders</Typography>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ElectricBorder color="#3b82f6" borderRadius={24}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <Typography variant="p" className="text-center font-bold italic">
                  High Intensity Focus
                </Typography>
              </Card>
            </ElectricBorder>
            <ElectricBorder color="#a855f7" borderRadius={24} chaos={0.3}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <Typography variant="p" className="text-center font-bold italic">
                  Deep Recovery
                </Typography>
              </Card>
            </ElectricBorder>
            <ElectricBorder color="#22c55e" borderRadius={24} speed={1.5}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <Typography variant="p" className="text-center font-bold italic">
                  Optimal Performance
                </Typography>
              </Card>
            </ElectricBorder>
          </div>
        </section>

        {/* Shiny Text & CountUp Section */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <Typography variant="h3">Shiny Typography</Typography>
            </div>
            <Card className="flex min-h-[200px] items-center justify-center bg-black p-12">
              <div className="text-4xl font-bold md:text-5xl">
                <ShinyText text="Unlock Your Potential" disabled={false} speed={3} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <Typography variant="h3">Dynamic Counters</Typography>
            </div>
            <Card className="flex min-h-[200px] flex-col items-center justify-center p-8">
              <div className="flex items-baseline gap-1 text-6xl font-black tracking-tighter tabular-nums">
                <CountUp from={0} to={98.4} duration={2} />
                <span className="text-muted-foreground text-2xl">%</span>
              </div>
              <Typography
                variant="muted"
                className="mt-2 text-xs font-bold tracking-widest uppercase"
              >
                Accuracy Score
              </Typography>
            </Card>
          </div>
        </section>
      </PageContainer>
    </div>
  ),
};

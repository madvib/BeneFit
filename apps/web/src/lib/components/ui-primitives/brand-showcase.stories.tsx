import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  typography,
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
          <h1 className={`${typography.displayXl} text-white`}>
            Elevate the <ShinyText text="Fitness Experience" speed={3} />
          </h1>
          <p className={`${typography.lead} mx-auto max-w-2xl text-white/60`}>
            Our brand system combines dynamic motion, electric accents, and glassy surfaces to
            create a premium, state-of-the-art interface.
          </p>
        </div>
      </section>

      <PageContainer className="space-y-16">
        {/* Electric Border Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="text-primary h-5 w-5" />
            <h3 className={typography.h3}>Electric Borders</h3>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <ElectricBorder color="#3b82f6" borderRadius={24}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <p className={`${typography.p} text-center font-bold italic`}>
                  High Intensity Focus
                </p>
              </Card>
            </ElectricBorder>
            <ElectricBorder color="#a855f7" borderRadius={24} chaos={0.3}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <p className={`${typography.p} text-center font-bold italic`}>Deep Recovery</p>
              </Card>
            </ElectricBorder>
            <ElectricBorder color="#22c55e" borderRadius={24} speed={1.5}>
              <Card className="bg-background/50 flex h-48 items-center justify-center p-6 backdrop-blur-sm">
                <p className={`${typography.p} text-center font-bold italic`}>
                  Optimal Performance
                </p>
              </Card>
            </ElectricBorder>
          </div>
        </section>

        {/* Shiny Text & CountUp Section */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <h3 className={typography.h3}>Shiny Typography</h3>
            </div>
            <Card className="flex min-h-[200px] items-center justify-center bg-black p-12">
              <div className={typography.displayLgResponsive}>
                <ShinyText text="Unlock Your Potential" disabled={false} speed={3} />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-primary h-5 w-5" />
              <h3 className={typography.h3}>Dynamic Counters</h3>
            </div>
            <Card className="flex min-h-[200px] flex-col items-center justify-center p-8">
              <div className={`${typography.displayXl} flex items-baseline gap-1 tabular-nums`}>
                <CountUp from={0} to={98.4} duration={2} />
                <span className={`${typography.h3} text-muted-foreground`}>%</span>
              </div>
              <p className={`${typography.labelXs} mt-2`}>Accuracy Score</p>
            </Card>
          </div>
        </section>
      </PageContainer>
    </div>
  ),
};

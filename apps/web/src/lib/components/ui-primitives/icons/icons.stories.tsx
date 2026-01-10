import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Target, User, Dumbbell, Calendar, Sparkles } from 'lucide-react';
import IconBox from './icon-box';
import { GarminLogo, StravaLogo } from './service-logos';
import LogoLoop from './logo-loop';

const meta: Meta = {
  title: 'Primitives/Icons',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Showcase: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 p-8">
      {/* IconBox Section */}
      <section className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          IconBox Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          <IconBox icon={Activity} variant="default" />
          <IconBox icon={Target} variant="secondary" />
          <IconBox icon={User} variant="muted" />
          <IconBox icon={Dumbbell} variant="accent" />
          <IconBox icon={Calendar} variant="outline" />
          <IconBox icon={Sparkles} variant="ghost" />
        </div>
      </section>

      {/* IconBox Sizes */}
      <section className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          IconBox Sizes
        </h3>
        <div className="flex flex-wrap items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <IconBox icon={Activity} size="sm" />
            <span className="text-[10px] font-medium uppercase">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <IconBox icon={Activity} size="md" />
            <span className="text-[10px] font-medium uppercase">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <IconBox icon={Activity} size="lg" />
            <span className="text-[10px] font-medium uppercase">Large</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <IconBox icon={Activity} size="xl" />
            <span className="text-[10px] font-medium uppercase">Extra Large</span>
          </div>
        </div>
      </section>

      {/* Service Logos */}
      <section className="space-y-4">
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Service Logos
        </h3>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10">
              <GarminLogo />
            </div>
            <span className="text-[10px] font-medium uppercase">Garmin</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10">
              <StravaLogo />
            </div>
            <span className="text-[10px] font-medium uppercase">Strava</span>
          </div>
        </div>
      </section>

      {/* Logo Loop Showcase */}
      <section className="max-w-xl space-y-4">
        <h3 className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
          Logo Loop (Integration Partners)
        </h3>
        <div className="bg-background overflow-hidden rounded-2xl border py-8">
          <LogoLoop
            logos={[
              { alt: 'Apple Health', src: '/connection_logos/icons8-apple-fitness-48.png' },
              { alt: 'Google Fit', src: '/connection_logos/google-fit-svgrepo-com.svg' },
              { alt: 'Strava', src: '/connection_logos/strava-svgrepo-com.svg' },
              { alt: 'Fitbit', src: '/connection_logos/icons8-fitbit-48.png' },
              { alt: 'WHOOP', src: '/connection_logos/whoop.svg' },
            ]}
          />
        </div>
      </section>
    </div>
  ),
};

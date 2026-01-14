import type { Meta, StoryObj } from '@storybook/react';
import { Trophy, Settings, Star, Activity, Flame, Clock } from 'lucide-react';
import { typography, MetricCard } from '../..';
import {Button} from '../buttons/button';
import {ImageCard} from './image-card';
import {SpotlightCard} from './spotlight-card';
import {Card} from './card';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Showcase: Story = {
  render: () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Standard Card */}
      <Card title="Standard Card" className="h-40">
        <p className="text-muted-foreground">This is a basic card content area.</p>
      </Card>

      {/* With Icon */}
      <Card title="With Icon" icon={Trophy} description="Optional description text">
        <div className="space-y-2">
          <div className="bg-muted h-2 w-full rounded" />
          <div className="bg-muted h-2 w-3/4 rounded" />
          <div className="bg-muted h-2 w-1/2 rounded" />
        </div>
      </Card>

      {/* Interactive Header */}
      <Card
        title="Interactive Header"
        icon={Settings}
        headerAction={
          <Button size="sm" variant="outline">
            Action
          </Button>
        }
      >
        <p className="text-muted-foreground">Card with a header action button.</p>
      </Card>

      {/* Borderless Variant */}
      <Card title="Borderless" variant="borderless" icon={Star}>
        <p className="text-muted-foreground">A card without borders for subtle sections.</p>
      </Card>

      {/* Spotlight Effect */}
      <div className="rounded-3xl bg-black/5 p-4">
        <SpotlightCard>
          <div className="relative z-10 text-center">
            <h3 className={`mb-2 ${typography.h4} font-bold`}>Spotlight Effect</h3>
            <p className="text-muted-foreground">
              Hover to see the radial gradient tracking your cursor.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* Image Card */}
      <ImageCard
        src="https://picsum.photos/id/237/600/400"
        alt="Demo Image"
        width={600}
        height={400}
      />

      {/* Metric Cards Row */}
      <div className="col-span-full space-y-4">
         <h3 className={`${typography.h4} border-b pb-2`}>Metric Cards</h3>
         <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard 
               label="Calories" 
               value="450" 
               unit="kcal" 
               icon={Flame} 
               iconClassName="text-orange-500" 
            />
            <MetricCard 
               label="Duration" 
               value="45" 
               unit="min" 
               icon={Clock} 
               iconClassName="text-blue-500" 
            />
            <MetricCard 
               label="Energy" 
               value="High" 
               icon={Activity} 
               bodyClassName="capitalize" 
               iconClassName="text-green-500" 
            />
            <MetricCard 
               label="RPE" 
               value="8" 
               unit="/10" 
               icon={Trophy} 
               iconClassName="text-yellow-500" 
            />
         </div>
      </div>
    </div>
  ),
};

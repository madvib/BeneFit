import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './progress-bar';
import { Carousel } from '../carousel/carousel';
import { typography } from '@/lib/components';

const meta: Meta<typeof ProgressBar> = {
  title: 'Primitives/Progress Bar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Showcase: Story = {
  render: () => (
    <Carousel>
      {/* Standard Progress Levels */}
      <div className="w-96 space-y-6">
        <div className="space-y-2">
          <p className={typography.labelSm}>0% - Empty</p>
          <ProgressBar value={0} max={100} />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>25% - Low</p>
          <ProgressBar value={25} max={100} />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>50% - Half</p>
          <ProgressBar value={50} max={100} />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>75% - High</p>
          <ProgressBar value={75} max={100} />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>100% - Complete</p>
          <ProgressBar value={100} max={100} />
        </div>
      </div>

      {/* Variants */}
      <div className="w-96 space-y-6">
        <div className="space-y-2">
          <p className={typography.labelSm}>Default Variant</p>
          <ProgressBar value={60} max={100} variant="default" />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>Success Variant</p>
          <ProgressBar value={85} max={100} barVariant="success" />
        </div>
      </div>

      {/* Sizes */}
      <div className="w-96 space-y-6">
        <div className="space-y-2">
          <p className={typography.labelSm}>Small Size</p>
          <ProgressBar value={65} max={100} size="sm" />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>Medium Size (Default)</p>
          <ProgressBar value={65} max={100} size="md" />
        </div>
        <div className="space-y-2">
          <p className={typography.labelSm}>Large Size</p>
          <ProgressBar value={65} max={100} size="lg" />
        </div>
      </div>
    </Carousel>
  ),
};

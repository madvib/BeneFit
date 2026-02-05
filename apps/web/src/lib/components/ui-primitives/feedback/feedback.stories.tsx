import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, LoadingSpinner, Skeleton, Button, Card, typography } from '../../index';
import { Search, AlertTriangle } from 'lucide-react';

const meta: Meta = {
  title: 'Primitives/Feedback',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const FeedbackShowcase: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 p-4">
      
      {/* Empty States Section */}
      <section className="space-y-4">
        <h3 className={typography.h4}>Empty States</h3>
        <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search or filters."
            />
            <EmptyState
              icon={AlertTriangle}
              title="Something went wrong"
              description="We couldn't load the data."
              iconClassName="bg-destructive/10 text-destructive"
              action={<Button variant="outline" size="sm">Try Again</Button>}
            />
        </div>
      </section>

      {/* Loading Spinners Section */}
      <section className="space-y-4">
         <h3 className={typography.h4}>Loading Spinners</h3>
         <div className="flex items-center gap-8 rounded-lg border p-6">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner text="With text..." />
         </div>
         <div className="relative flex h-[150px] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/20">
            <LoadingSpinner variant="screen" text="Container Variant" />
         </div>
      </section>

      {/* Skeletons Section */}
      <section className="space-y-4">
        <h3 className={typography.h4}>Skeletons</h3>
        <Card className="w-full max-w-sm p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="flex justify-between pt-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-4 w-20" />
              </div>
            </div>
        </Card>
      </section>

    </div>
  ),
};

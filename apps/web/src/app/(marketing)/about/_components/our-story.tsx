import { Play } from 'lucide-react';
import { SpotlightCard, typography } from '@/lib/components';

export default function OurStory() {
  return (
    <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2">
      <div>
        <h2 className={`${typography.h2} mb-6`}>Our Story</h2>
        <p className={`${typography.p} mb-4`}>
          BeneFit was founded in 2020 by a team of fitness enthusiasts and software engineers who
          were frustrated with the lack of comprehensive tools available to track and analyze
          fitness progress.
        </p>
        <p className={`${typography.p} mb-4`}>
          We recognized that people were using multiple apps to track different aspects of their
          fitness journey, making it difficult to get a complete picture of their health and
          progress.
        </p>
        <p className={typography.p}>
          Our solution brings together workout tracking, nutrition monitoring, progress analytics,
          and social features in one powerful, easy-to-use platform.
        </p>
      </div>

      <SpotlightCard className="flex items-center justify-center">
        <div className="aspect-w-16 aspect-h-9 bg-background flex items-center justify-center rounded-lg">
          <div className="p-8 text-center">
            <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <Play />
            </div>
            <h3 className={`${typography.h3} mb-2`}>Our Mission</h3>
            <p className={`${typography.p} text-muted-foreground`}>
              Empower individuals to take control of their health and fitness journey through
              data-driven insights and community support.
            </p>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

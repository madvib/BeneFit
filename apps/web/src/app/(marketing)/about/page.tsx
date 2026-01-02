import { PageContainer } from '@/lib/components';
import {
  AboutHero,
  AboutOurStory,
  AboutTestimonials,
  AboutBenefits,
  AboutCallToAction,
} from '@/app/(marketing)/about/#components';

export default function AboutPage() {
  return (
    <PageContainer>
      <AboutHero />
      <AboutOurStory />
      <AboutTestimonials />
      <AboutBenefits />
      <AboutCallToAction />
    </PageContainer>
  );
}

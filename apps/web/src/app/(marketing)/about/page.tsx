import { PageContainer } from '@/lib/components';
import {
  AboutHero,
  AboutOurStory,
  AboutTestimonials,
  AboutBenefits,
  AboutCallToAction,
} from './#components';

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

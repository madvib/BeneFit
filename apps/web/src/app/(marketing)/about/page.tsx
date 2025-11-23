import { PageContainer } from '@/components';
import {
  AboutHero,
  AboutOurStory,
  AboutTeamMembers,
  AboutBenefits,
  AboutCallToAction,
} from '@/components/marketing/about';

export default function AboutPage() {
  return (
    <PageContainer>
      <AboutHero />
      <AboutOurStory />
      <AboutTeamMembers />
      <AboutBenefits />
      <AboutCallToAction />
    </PageContainer>
  );
}

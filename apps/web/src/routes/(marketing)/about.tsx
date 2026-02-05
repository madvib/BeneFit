import { createFileRoute } from '@tanstack/react-router';
import { PageContainer, PageHeader } from '@/lib/components';
import {
  AboutOurStory,
  AboutTestimonials,
  AboutBenefits,
  AboutCallToAction,
} from './-components';

export const Route = createFileRoute('/(marketing)/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageContainer>
      <PageHeader
        title="About BeneFit"
        description="    Our mission is to help you achieve your fitness goals through powerful tracking,
        analytics, and community support."
        className="mb-12 text-center"
      />
      <AboutOurStory />
      <AboutTestimonials />
      <AboutBenefits />
      <AboutCallToAction />
    </PageContainer>
  );
}

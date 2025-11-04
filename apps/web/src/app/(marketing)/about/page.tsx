import { 
  AboutHero, 
  AboutOurStory, 
  AboutTeamMembers, 
  AboutBenefits, 
  AboutCallToAction 
} from '@/components/marketing/about';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-8">
      <AboutHero />
      <AboutOurStory />
      <AboutTeamMembers />
      <AboutBenefits />
      <AboutCallToAction />
    </div>
  );
}

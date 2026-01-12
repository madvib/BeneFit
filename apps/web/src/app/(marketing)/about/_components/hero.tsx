import { typography } from '@/lib/components/theme/typography';

export default function Hero() {
  return (
    <div className="mb-12 text-center">
      <h1 className={`${typography.displayLg} mb-4`}>About BeneFit</h1>
      <p className={`${typography.lead} mx-auto max-w-3xl`}>
        Our mission is to help you achieve your fitness goals through powerful tracking,
        analytics, and community support.
      </p>
    </div>
  );
}

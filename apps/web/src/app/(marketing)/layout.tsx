import MarketingLayout from '@/components/marketing/marketing-layout';

export default function MarketingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}

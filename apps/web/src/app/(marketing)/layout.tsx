import MarketingLayout from "@/presentation/layouts/marketing-layout";

export default function MarketingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}

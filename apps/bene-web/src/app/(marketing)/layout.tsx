import MarketingLayout from "@/components/layouts/MarketingLayout";

export default function MarketingLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}

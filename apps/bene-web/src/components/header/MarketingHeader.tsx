"use client";

import { useSession } from "@/hooks/useSession";
import PublicNav from "@/components/navigation/PublicNav";
import BaseHeader from "@/components/header/BaseHeader";
import { AuthNavigation } from "@/components/navigation/AuthNavigation";

const marketingNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export default function MarketingHeader({
  className = "",
}: {
  className?: string;
}) {
  const { user, isLoading } = useSession();
  const isLoggedIn = !!user && !isLoading;

  return (
    <BaseHeader
      navLinks={marketingNavLinks}
      isLoggedIn={isLoggedIn}
      className={className}
    >
      <PublicNav isLoggedIn={isLoggedIn} />
      <div className="flex items-center gap-4">
        <AuthNavigation />
      </div>
    </BaseHeader>
  );
}

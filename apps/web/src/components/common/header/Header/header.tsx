"use client";

import UnifiedHeader from "../UnifiedHeader/unified-header";

type HeaderProperties = {
  variant?: "marketing" | "user" | "dashboard";
};

export default function Header({ variant = "marketing" }: HeaderProperties) {
  return <UnifiedHeader variant={variant} />;
}

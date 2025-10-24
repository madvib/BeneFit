"use client";

import { ReactNode } from "react";

interface ButtonGroupProperties {
  children: ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function ButtonGroup({
  children,
  className = "",
  align = "left",
}: ButtonGroupProperties) {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      data-testid="button-group"
      className={`flex flex-wrap gap-3 ${alignmentClasses[align satisfies keyof typeof alignmentClasses]} ${className}`}
    >
      {children}
    </div>
  );
}

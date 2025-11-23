"use client";

import { ReactNode } from "react";
import { DataCard } from '@/components';

interface StatCardProperties {
  title: string;
  value: string | number;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  className = "",
}: StatCardProperties) {
  return (
    <DataCard
      title={title}
      value={value}
      description={description}
      icon={icon}
      className={className}
      variant="default"
    />
  );
}

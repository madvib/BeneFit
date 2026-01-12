'use client';

import { useMemo } from 'react';

/**
 * [DRAFT] A hook to manage RPE (Perceived Exertion) logic and labels.
 */
export function useRPE(value: number) {
  const label = useMemo(() => {
    if (value <= 2) return 'Active Recovery';
    if (value <= 4) return 'Flow State';
    if (value <= 6) return 'High Performance';
    if (value <= 8) return 'Peak Challenge';
    return 'Total Failure';
  }, [value]);

  const description = useMemo(() => {
    if (value <= 2) return 'Very light effort, easy to maintain.';
    if (value <= 4) return 'Sustainable effort, feeling good.';
    if (value <= 6) return 'Challenging but controlled effort.';
    if (value <= 8) return 'Very hard effort, pushing limits.';
    return 'Maximum effort, near total exhaustion.';
  }, [value]);

  const colorClass = useMemo(() => {
    if (value <= 2) return 'text-emerald-500';
    if (value <= 4) return 'text-blue-500';
    if (value <= 6) return 'text-primary';
    if (value <= 8) return 'text-orange-500';
    return 'text-rose-500';
  }, [value]);

  return {
    label,
    description,
    colorClass,
  };
}

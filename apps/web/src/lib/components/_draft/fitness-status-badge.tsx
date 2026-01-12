'use client';

import { Badge } from '@/lib/components/ui-primitives';

type FitnessStatus =
  | 'completed'
  | 'in_progress'
  | 'skipped'
  | 'abandoned'
  | 'scheduled'
  | 'draft'
  | string;

interface FitnessStatusBadgeProps {
  status: FitnessStatus;
  className?: string;
}

/**
 * [DRAFT] A specialized badge for fitness-related statuses.
 * Centralizes the mapping of backend status strings to UI primitive variants.
 */
export default function FitnessStatusBadge({ status, className }: FitnessStatusBadgeProps) {
  const getBadgeVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'completed':
      case 'finished':
        return 'success';
      case 'in_progress':
      case 'active':
      case 'live':
        return 'info';
      case 'skipped':
      case 'abandoned':
      case 'cancelled':
        return 'error';
      case 'scheduled':
      case 'pending':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const label = status.replaceAll('_', ' ');

  return (
    <Badge
      variant={getBadgeVariant(status)}
      className={`font-bold tracking-tighter uppercase ${className || ''}`}
    >
      {label}
    </Badge>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ActivityData, getActivityFeed } from './get-activity-feed';

/**
 * Custom hook for managing activity feed data
 * Separates business logic from presentation concerns
 */
export const useActivityFeed = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(undefined);

        const result = await getActivityFeed();

        if (result.success) {
          setActivities(result.data);
        } else {
          throw result.error || 'Failed to fetch activity feed';
        }
      } catch (error_) {
        console.error('Error fetching activity feed:', error_);
        setError(typeof error_ === 'string' ? error_ : 'Failed to fetch activity feed');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    refetch: () => {
      // Re-trigger the data fetch
      const fetchActivities = async () => {
        try {
          setLoading(true);
          setError(undefined);

          const result = await getActivityFeed();

          if (result.success) {
            setActivities(result.data);
          } else {
            throw result.error || 'Failed to fetch activity feed';
          }
        } catch (error_) {
          setError(
            typeof error_ === 'string' ? error_ : 'Failed to fetch activity feed',
          );
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    },
  };
};

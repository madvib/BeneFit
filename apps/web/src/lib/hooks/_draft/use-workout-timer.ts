'';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * [DRAFT] A hook to manage workout session timing.
 * Supports start, pause, resume, reset and tick callbacks.
 */
export function useWorkoutTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
  }, []);

  const resume = useCallback(() => {
    setIsActive(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  return {
    seconds,
    isActive,
    start,
    pause,
    resume,
    reset,
    setSeconds,
  };
}

/**
 * [DRAFT] Utility to format seconds into HH:MM:SS or MM:SS
 */
export function formatDuration(totalSeconds: number, includeHours = false) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ];

  if (includeHours || hours > 0) {
    parts.unshift(hours.toString().padStart(2, '0'));
  }

  return parts.join(':');
}

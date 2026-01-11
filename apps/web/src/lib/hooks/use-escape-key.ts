import { useEffect } from 'react';

/**
 * Hook to handle Escape key press.
 * @param onEscape Callback function to execute when Escape key is pressed.
 * @param isActive Whether the listener should be active. Defaults to true.
 */
export const useEscapeKey = (onEscape: () => void, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive, onEscape]);
};

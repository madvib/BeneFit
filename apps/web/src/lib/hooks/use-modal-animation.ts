import { useEffect, useState } from 'react';

/**
 * Hook for managing modal visibility with smooth animations
 * Handles the timing between mounting/unmounting and CSS transitions
 * 
 * @param isOpen - Whether the modal should be open
 * @param delay - Delay in ms before triggering visibility state (default: 10ms)
 * @returns isVisible - Whether the modal should show its visible state (for CSS transitions)
 * 
 * @example
 * ```tsx
 * const { isVisible } = useModalAnimation(isOpen);
 * 
 * if (!isOpen) return null;
 * 
 * return (
 *   <div className={`transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
 *     Modal content
 *   </div>
 * );
 * ```
 */
export function useModalAnimation(isOpen: boolean, delay = 10) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Defer state update to allow mounting and trigger animation
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setIsVisible(false), delay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, delay]);

  return { isVisible };
}

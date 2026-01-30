import React, { useRef, useState } from 'react';
import { useTheme } from 'tanstack-theme-kit';
import { useHydrated } from '@/lib/hooks/use-hydrated';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  lightSpotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  darkSpotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  lightSpotlightColor = 'rgba(179, 215, 255, .3)',
  darkSpotlightColor = 'rgba(0, 150, 200, 0.3)',
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);
  const { resolvedTheme } = useTheme();

  const hydrated = useHydrated();

  // Determine the spotlight color based on the current theme (avoid hydration mismatch)
  const spotlightColor =
    hydrated && resolvedTheme === 'dark' ? darkSpotlightColor : lightSpotlightColor;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`bg-background border-muted relative overflow-hidden rounded-3xl border p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};



import React from 'react';

interface IconBoxProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function IconBox({ children, className, size = 'md', variant = 'primary' }: IconBoxProps) {
  let sizeClass = 'h-16 w-16 text-3xl'; // md
  if (size === 'sm') sizeClass = 'h-10 w-10 text-xl';
  if (size === 'lg') sizeClass = 'h-20 w-20 text-4xl';

  let variantClass = 'bg-primary text-primary-foreground'; // primary
  if (variant === 'secondary') variantClass = 'bg-secondary text-secondary-foreground';
  if (variant === 'ghost') variantClass = 'bg-transparent text-primary';

  return (
    <div
      className={`mx-auto flex items-center justify-center rounded-full ${sizeClass} ${variantClass} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

'use client';

import {ReactNode} from 'react';

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function ButtonGroup({
  children,
  className = '',
  align = 'left',
}: ButtonGroupProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      data-testid="button-group"
      className={`flex flex-wrap gap-3 ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
}

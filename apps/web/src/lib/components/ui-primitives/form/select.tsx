import { SelectHTMLAttributes } from 'react';

type SelectProps = {
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ className = '', children, ...props }: SelectProps) {
  return (
    <select
      className={`bg-background border-muted text-foreground focus:ring-primary/20 cursor-pointer appearance-none rounded-lg border py-2 pr-8 pl-3 text-sm focus:ring-2 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

import { LabelHTMLAttributes } from 'react';

type LabelProps = {
  className?: string;
} & LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

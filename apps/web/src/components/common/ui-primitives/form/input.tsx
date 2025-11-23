import { InputHTMLAttributes } from 'react';

type InputProps = {
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`border-muted bg-background focus:ring-primary/20 w-full rounded border p-2 focus:ring-2 focus:outline-none ${className}`}
      {...props}
    />
  );
}

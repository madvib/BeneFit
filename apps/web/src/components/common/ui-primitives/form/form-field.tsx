import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  error?: string;
  description?: string;
  className?: string;
}

export default function FormField({ 
  label, 
  htmlFor, 
  children, 
  error, 
  description, 
  className = '' 
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={htmlFor} 
        className="block text-foreground font-medium text-sm"
      >
        {label}
      </label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
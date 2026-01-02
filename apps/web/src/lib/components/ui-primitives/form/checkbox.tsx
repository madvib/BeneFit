import { InputHTMLAttributes } from 'react';

type CheckboxProps = {
  label?: string;
  error?: string;
  description?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Checkbox({ 
  label, 
  error, 
  description,
  className = '', 
  ...props 
}: CheckboxProps) {
  return (
    <div className="flex items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className={`sr-only peer ${className}`}
          {...props}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
      {label && (
        <span className="ml-3 text-sm font-medium text-foreground">
          {label}
        </span>
      )}
      {error && <p className="text-xs text-red-600 ml-3">{error}</p>}
      {description && <p className="text-xs text-muted-foreground ml-3">{description}</p>}
    </div>
  );
}
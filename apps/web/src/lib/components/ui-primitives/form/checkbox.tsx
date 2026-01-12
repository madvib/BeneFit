import { InputHTMLAttributes } from 'react';
import { typography } from '@/lib/components/theme/typography';

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
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" className={`peer sr-only ${className}`} {...props} />
        <div className="peer peer-checked:bg-primary h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
      </label>
      {label && <span className={`${typography.small} text-foreground ml-3`}>{label}</span>}
      {error && <p className={`${typography.xs} ml-3 text-red-600`}>{error}</p>}
      {description && (
        <p className={`${typography.xs} text-muted-foreground ml-3`}>{description}</p>
      )}
    </div>
  );
}

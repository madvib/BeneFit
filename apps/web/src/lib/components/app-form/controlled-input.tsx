import { InputHTMLAttributes } from 'react';
import { Input } from '../ui-primitives';
import { useFieldContext } from './app-form';
import { typography } from '../theme/typography';

type ControlledInputProps = {
  label: string;
  placeholder?: string;
  description?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function ControlledInput({
  label,
  placeholder,
  description,
  ...props
}: ControlledInputProps) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.name} className={`${typography.small} mb-1.5 block`}>
        {label}
      </label>
      <Input
        id={field.name}
        name={field.name}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={(e) => {
          // Prevent validation when clicking navigation links or other buttons
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (
            relatedTarget?.tagName === 'A' ||
            relatedTarget?.tagName === 'BUTTON' ||
            relatedTarget?.closest('a') ||
            relatedTarget?.closest('button') ||
            relatedTarget?.getAttribute('role') === 'link' ||
            relatedTarget?.getAttribute('role') === 'button'
          ) {
            return;
          }
          field.handleBlur();
        }}
        onChange={(e) => field.handleChange(e.target.value)}
        className={field.state.meta.errors.length ? 'border-red-500' : ''}
        aria-invalid={field.state.meta.errors.length > 0 ? 'true' : 'false'}
        {...props}
      />
      <div className="mt-1 transition-all duration-200">
        {field.state.meta.errors.length > 0 ? (
          <p className={`${typography.xs} animate-in fade-in slide-in-from-top-1 text-red-500`}>
            {field.state.meta.errors.map((err) => err?.message).join(', ')}
          </p>
        ) : (
          description && <p className={`${typography.xs} text-muted-foreground`}>{description}</p>
        )}
      </div>
    </div>
  );
}

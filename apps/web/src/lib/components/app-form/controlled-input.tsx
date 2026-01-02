import { InputHTMLAttributes } from 'react';
import { Input } from '../ui-primitives';
import { useFieldContext } from './app-form';

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
      <label htmlFor={field.name} className="text-foreground block text-sm font-medium">
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
          <p className="animate-in fade-in slide-in-from-top-1 text-xs text-red-500">
            {field.state.meta.errors.map((err: any) => err?.message).join(', ')}
          </p>
        ) : description ? (
          <p className="text-muted-foreground text-xs">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

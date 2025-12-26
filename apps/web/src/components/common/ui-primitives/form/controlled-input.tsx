import { AnyFieldApi } from '@tanstack/react-form';
import { Input } from '@/components';
import { HTMLInputTypeAttribute } from 'react';

interface ControlledInputProps {
  field: AnyFieldApi;
  label: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  description?: string;
}

export function ControlledInput({
  field,
  label,
  type = 'text',
  placeholder,
  description,
}: ControlledInputProps) {
  return (
    <>
      <label htmlFor={field.name} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        // The "Wiring" logic lives here once, not in 10 different files
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={field.state.meta.errors.length ? 'border-red-500' : ''}
        aria-invalid={field.state.meta.errors.length > 0 ? 'true' : 'false'}
      />
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
      {/* Centralized error display logic */}
      {field.state.meta.errors.length > 0 && (
        <p className="mt-1 text-xs text-red-500">
          {field.state.meta.errors.map((err: any) => err?.message).join(', ')}
        </p>
      )}
    </>
  );
}

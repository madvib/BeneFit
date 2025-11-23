import { useFormStatus } from 'react-dom';
import { Button, FormField, Input } from '@/components';

// Submit button component that shows loading state
export function AuthSubmitButton({
  children,
  pendingText,
}: {
  children: React.ReactNode;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" type="submit" disabled={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}

// Email input field component
export function EmailInput() {
  return (
    <FormField label="Email">
      <Input
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        aria-describedby="email-error"
      />
    </FormField>
  );
}

// Password input field component
export function PasswordInput({
  label = 'Password',
  name = 'password',
}: {
  label?: string;
  name?: string;
}) {
  return (
    <FormField label={label}>
      <Input
        type="password"
        id={name}
        name={name}
        placeholder="••••••••"
        required
        aria-describedby={`${name}-error`}
      />
    </FormField>
  );
}

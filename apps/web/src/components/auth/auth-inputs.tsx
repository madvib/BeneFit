import { useFormStatus } from 'react-dom';

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
    <button className="w-full btn btn-primary" type="submit" aria-disabled={pending}>
      {pending ? pendingText : children}
    </button>
  );
}

// Email input field component
export function EmailInput() {
  return (
    <div className="mb-4">
      <label className="block text-secondary-foreground mb-2" htmlFor="email">
        Email
      </label>
      <input
        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
        type="email"
        id="email"
        name="email"
        placeholder="you@example.com"
        required
        aria-describedby="email-error"
      />
    </div>
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
    <div className="mb-4">
      <label className="block text-secondary-foreground mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
        type="password"
        id={name}
        name={name}
        placeholder="••••••••"
        required
        aria-describedby={`${name}-error`}
      />
    </div>
  );
}

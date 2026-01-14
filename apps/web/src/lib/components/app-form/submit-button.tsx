import { Button, type ButtonProps } from '@/lib/components';
import { useFormContext } from './app-form';

interface SubmitButtonProps extends ButtonProps {
  label?: string;
  submitLabel?: string;
  children?: React.ReactNode;
}

export function SubmitButton({ label, submitLabel, children, ...props }: Readonly<SubmitButtonProps>) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit} {...props}>
          {submitLabel && isSubmitting ? submitLabel : children || label}
        </Button>
      )}
    </form.Subscribe>
  );
}

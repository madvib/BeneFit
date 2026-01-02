import { Button } from '../ui-primitives';
import { useFormContext } from './app-form';

export function SubmitButton({ label, submitLabel }: { label: string; submitLabel?: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit} className="w-full">
          {submitLabel && isSubmitting ? submitLabel : label}
        </Button>
      )}
    </form.Subscribe>
  );
}

import { AlertCircle } from 'lucide-react';
import { SubmitError, useFormContext } from './app-form';
import { Button } from '../ui-primitives';
import { typography } from '../theme/typography';

export function SubmissionError() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.errorMap.onSubmit]}>
      {([error]) => {
        const submitError = error as SubmitError | undefined;
        if (!submitError) return null;
        return (
          <div
            className={`${typography.small} bg-error/15 space-y-2 overflow-hidden rounded-md p-3 text-red-500 transition-all duration-200`}
          >
            <div className="flex items-center gap-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="truncate">{submitError.message}</p>
            </div>
            {submitError.resolutions?.map((res, idx) => (
              <div
                key={idx}
                className={`${typography.muted} mt-2 flex flex-row items-center gap-2`}
              >
                <p>{res.message}</p>
                {res.actions?.map((act, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className={`${typography.small} text-primary text-center`}
                    onClick={act.action}
                  >
                    {act.label}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        );
      }}
    </form.Subscribe>
  );
}

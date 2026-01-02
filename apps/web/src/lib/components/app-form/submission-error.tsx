import { AlertCircle } from 'lucide-react';
import { SubmitError, useFormContext } from './app-form';
import { Button } from '../ui-primitives';

export function SubmissionError() {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => [state.errorMap.onSubmit]}>
      {([error]) => {
        const submitError = error as SubmitError | undefined;
        if (!submitError) return null;
        return (
          <div className="bg-error/15 space-y-2 overflow-hidden rounded-md p-3 text-sm text-red-500 transition-all duration-200">
            <div className="flex items-center gap-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="truncate">{submitError.message}</p>
            </div>
            {submitError.resolutions?.map((res, idx) => (
              <div
                key={idx}
                className="text-muted-foreground mt-2 flex flex-row items-center gap-2 text-sm"
              >
                <p>{res.message}</p>
                {res.actions?.map((act, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-primary text-center text-sm"
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

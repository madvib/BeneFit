import { AnyFormApi } from '@tanstack/react-form';
import { useCallback, useEffect, useState } from 'react';
import { SubmitError } from '../components';

export function useFormSubmitFeedback(form: AnyFormApi) {
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = form.store.subscribe((state) => {
      if (!state.currentVal.isSubmitting) {
        setSuccess(null);
      }
    });
    return unsub;
  }, [form])


  const submitError = useCallback(
    (error: SubmitError) => {
      form.setErrorMap({
        onSubmit: {
          fields: {},
          form: error,
        },
      });
    },
    [form],
  );

  const submitSuccess = useCallback((message?: string) => {
    if (message) {
      setSuccess(message);
    }
  }, []);

  return {
    success,
    submitError,
    submitSuccess,
  };
}

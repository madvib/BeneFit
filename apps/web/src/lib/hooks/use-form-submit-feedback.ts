import { useStore, AnyFormApi } from '@tanstack/react-form';
import { useEffect, useCallback, useState } from 'react';
import { SubmitError } from '../components';

export function useFormSubmitFeedback(form: AnyFormApi) {
  const [success, setSuccess] = useState<string | null>(null);
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  useEffect(() => {
    if (isSubmitting) {
      setSuccess(null);
    }
    return setSuccess(null);
  }, [isSubmitting]);

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

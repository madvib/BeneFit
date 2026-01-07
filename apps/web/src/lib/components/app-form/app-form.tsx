'use client';
import { createFormHookContexts, createFormHook } from '@tanstack/react-form';
import { ControlledInput } from './controlled-input';
import { Root } from './form-root';
import { SubmissionError } from './submission-error';
import { SubmitButton } from './submit-button';

export interface SubmitErrorAction {
  label: string; // button/link text
  action: () => void; // callback to execute
}

export interface SubmitErrorResolution {
  message: string; // explanatory text
  actions?: SubmitErrorAction[]; // optional actions
}

export interface SubmitError {
  message: string; // main error message
  resolutions?: SubmitErrorResolution[]; // one or more resolution blocks
}
// export useFieldContext for use in your custom components
export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { ControlledInput },
  formComponents: { SubmitButton, SubmissionError, Root },
});

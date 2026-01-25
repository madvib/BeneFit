import { formOptions, revalidateLogic } from '@tanstack/react-form';
import { trainingSchemas, type UpdateTrainingConstraintsFormValues } from '@bene/react-api-client';

export const trainingConstraintsFormOptions = formOptions({
  defaultValues: {} as UpdateTrainingConstraintsFormValues,
  validators: {
    onDynamic: trainingSchemas.UpdateTrainingConstraintsFormSchema,
  },
  validationLogic: revalidateLogic(),
});

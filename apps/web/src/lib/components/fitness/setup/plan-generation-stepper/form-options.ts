import { formOptions } from '@tanstack/react-form';
import { GeneratePlanFormSchema, type GeneratePlanFormValues } from '@bene/react-api-client';
import { revalidateLogic } from '@tanstack/react-form';

export const planGenerationFormOpts = formOptions({
  defaultValues: {
    goals: {
      primary: 'strength',
      secondary: [],
      targetMetrics: {
        totalWorkouts: 12, // 3 per week * 4 weeks
      },
    },
    availableEquipment: [],
    customInstructions: '',
  } as GeneratePlanFormValues,
  validators: {
    onDynamic: GeneratePlanFormSchema,
  },
  validationLogic: revalidateLogic(),
});
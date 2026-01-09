import { formOptions } from '@tanstack/react-form';
import { OnboardingFormSchema, type OnboardingFormValues } from '@bene/shared';
import { revalidateLogic } from '@tanstack/react-form';

export const onboardingFormOpts = formOptions({
  defaultValues: {
    displayName: '',
    location: '',
    bio: '',
    experienceLevel: 'beginner',
    primaryGoal: 'strength',
    secondaryGoals: [],
    daysPerWeek: 3,
    minutesPerWorkout: 45,
    equipment: [],
  } as OnboardingFormValues,
  validators: {
    onDynamic: OnboardingFormSchema,
  },
  validationLogic: revalidateLogic(),
});

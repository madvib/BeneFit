import { formOptions } from '@tanstack/react-form';
import { profileSchemas } from '@bene/react-api-client';
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
  } as profileSchemas.OnboardingFormValues,
  validators: {
    onDynamic: profileSchemas.OnboardingSchema,
  },
  validationLogic: revalidateLogic(),
});

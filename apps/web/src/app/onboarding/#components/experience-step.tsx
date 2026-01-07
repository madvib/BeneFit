import { withForm } from '@/lib/components/app-form/app-form';
import { onboardingFormOpts } from './form-options';

export const ExperienceStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="grid gap-4">
      <form.AppField name="experienceLevel">
        {(field) => (
          <>
            {(
              [
                {
                  value: 'beginner',
                  label: 'Beginner',
                  desc: 'New to training or returning after a long break.',
                },
                {
                  value: 'intermediate',
                  label: 'Intermediate',
                  desc: 'Consistent training for 6+ months.',
                },
                { value: 'advanced', label: 'Advanced', desc: 'Training seriously for years.' },
              ] as const
            ).map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => field.handleChange(level.value)}
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  field.state.value === level.value
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'hover:border-primary/50'
                }`}
              >
                <div
                  className={`mt-1 h-5 w-5 rounded-full border-2 ${
                    field.state.value === level.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                />
                <div>
                  <h3 className="font-semibold">{level.label}</h3>
                  <p className="text-muted-foreground text-sm">{level.desc}</p>
                </div>
              </button>
            ))}
          </>
        )}
      </form.AppField>
    </div>
  ),
});

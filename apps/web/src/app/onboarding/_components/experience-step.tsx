import { withForm } from '@/lib/components/app-form/app-form';
import { EXPERIENCE_LEVELS } from '@bene/shared';
import { onboardingFormOpts } from './form-options';

export const ExperienceStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="grid gap-4">
      <form.AppField name="experienceLevel">
        {(field) => (
          <>
            {EXPERIENCE_LEVELS.map((level) => {
              const details = {
                beginner: {
                  label: 'Beginner',
                  desc: 'New to training or returning after a long break.',
                },
                intermediate: {
                  label: 'Intermediate',
                  desc: 'Consistent training for 6+ months.',
                },
                advanced: { label: 'Advanced', desc: 'Training seriously for years.' },
              }[level] || { label: level, desc: '' };

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => field.handleChange(level)}
                  className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                    field.state.value === level
                      ? 'border-primary bg-primary/5 ring-primary ring-1'
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded-full border-2 ${
                      field.state.value === level
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold">{details.label}</h3>
                    <p className="text-muted-foreground text-sm">{details.desc}</p>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </form.AppField>
    </div>
  ),
});

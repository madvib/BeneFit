import { onboardingFormOpts } from './form-options';
import { typography, withForm } from '@/lib/components';
export const BioStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="space-y-6">
        <form.AppField name="displayName">
          {(field) => (
            <field.ControlledInput
              label="What should we call you?"
              placeholder="Your name"
              autoFocus
              className={typography.large}
            />
          )}
        </form.AppField>
        <form.AppField name="location">
          {(field) => (
            <field.ControlledInput label="Location" placeholder="City, Country (optional)" />
          )}
        </form.AppField>
        <form.AppField name="bio">
          {(field) => (
            <field.ControlledInput
              label="About You"
              placeholder="Tell us a bit about yourself... (optional)"
            />
          )}
        </form.AppField>
      </div>
      <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
        <p className={`${typography.small} text-muted-foreground flex items-center gap-2`}>
          <span>💡</span> You can always update this information later from your profile
        </p>
      </div>
    </div>
  ),
});

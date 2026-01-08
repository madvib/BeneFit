import { withForm } from '@/lib/components/app-form/app-form';
import { onboardingFormOpts } from './form-options';

export const BioStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-5">
      <form.AppField name="displayName">
        {(field) => (
          <field.ControlledInput
            label="What should we call you?"
            placeholder="Your name"
            autoFocus
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
      <p className="text-muted-foreground text-xs">
        💡 You can always update this information later from your profile
      </p>
    </div>
  ),
});

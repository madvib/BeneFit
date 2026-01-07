import { withForm } from '@/lib/components/app-form/app-form';
import { onboardingFormOpts } from './form-options';

export const BioStep = withForm({
  ...onboardingFormOpts,
  render: ({ form }) => (
    <div className="space-y-4">
      <form.AppField name="displayName">
        {(field) => (
          <field.ControlledInput
            label="Display Name"
            placeholder="What should we call you?"
            autoFocus
          />
        )}
      </form.AppField>
      <form.AppField name="location">
        {(field) => (
          <field.ControlledInput label="Location (Optional)" placeholder="City, Country" />
        )}
      </form.AppField>
      <form.AppField name="bio">
        {(field) => (
          <field.ControlledInput
            label="Bio (Optional)"
            placeholder="Tell us a bit about yourself..."
          />
        )}
      </form.AppField>
    </div>
  ),
});

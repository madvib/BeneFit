import { FormSection, Select, Switch, typography } from '@/lib/components';
type ProfileVisibility = 'Public' | 'Private';

interface PrivacySettingsProps {
  profileVisibility: ProfileVisibility;
  activitySharing: boolean;
  onProfileVisibilityChange: (_value: ProfileVisibility) => void;
  onActivitySharingChange: (_checked: boolean) => void;
}

export function PrivacySettings({
  profileVisibility,
  activitySharing,
  onProfileVisibilityChange,
  onActivitySharingChange,
}: PrivacySettingsProps) {
  return (
    <FormSection title="Privacy Settings">
      <div className="space-y-4">
        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <p className={`${typography.large} text-base font-medium`}>Profile Visibility</p>
            <p className={`${typography.small} text-muted-foreground block`}>
              Who can see your profile and activity
            </p>
          </div>
          <Select
            value={profileVisibility}
            onChange={(e) => onProfileVisibilityChange(e.target.value as 'Public' | 'Private')}
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </Select>
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div className="space-y-0.5">
            <p className={`${typography.large} text-base font-medium`}>Activity Sharing</p>
            <p className={`${typography.small} text-muted-foreground block`}>
              Share activities with friends
            </p>
          </div>
          <Switch checked={activitySharing} onCheckedChange={onActivitySharingChange} />
        </div>
      </div>
    </FormSection>
  );
}

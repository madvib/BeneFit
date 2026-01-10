import { FormSection, Select, Switch } from '@/lib/components';
import Typography from '@/lib/components/ui-primitives/typography/typography';

type ProfileVisibility = 'Public' | 'Private';

interface PrivacySettingsProps {
  profileVisibility: ProfileVisibility;
  activitySharing: boolean;
  onProfileVisibilityChange: (_value: ProfileVisibility) => void;
  onActivitySharingChange: (_checked: boolean) => void;
}

export default function PrivacySettings({
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
            <Typography variant="large" className="text-base font-medium">
              Profile Visibility
            </Typography>
            <Typography variant="small" className="text-muted-foreground block">
              Who can see your profile and activity
            </Typography>
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
            <Typography variant="large" className="text-base font-medium">
              Activity Sharing
            </Typography>
            <Typography variant="small" className="text-muted-foreground block">
              Share activities with friends
            </Typography>
          </div>
          <Switch checked={activitySharing} onCheckedChange={onActivitySharingChange} />
        </div>
      </div>
    </FormSection>
  );
}

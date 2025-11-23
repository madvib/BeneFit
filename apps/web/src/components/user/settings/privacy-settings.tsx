'use client';

import { FormSection, Select, Checkbox } from '@/components';

type ProfileVisibility = 'Public' | 'Friends Only' | 'Private';

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
          <div>
            <p className="font-medium">Profile Visibility</p>
            <p className="text-muted-foreground text-sm">
              Who can see your profile and activity
            </p>
          </div>
          <Select
            value={profileVisibility}
            onChange={(e) =>
              onProfileVisibilityChange(
                e.target.value as 'Public' | 'Friends Only' | 'Private',
              )
            }
          >
            <option value="Public">Public</option>
            <option value="Friends Only">Friends Only</option>
            <option value="Private">Private</option>
          </Select>
        </div>

        <div className="bg-background flex items-center justify-between rounded-lg p-3">
          <div>
            <p className="font-medium">Activity Sharing</p>
            <p className="text-muted-foreground text-sm">
              Share activities with friends
            </p>
          </div>
          <Checkbox
            checked={activitySharing}
            onChange={(e) => onActivitySharingChange(e.target.checked)}
          />
        </div>
      </div>
    </FormSection>
  );
}

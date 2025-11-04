'use client';

import { Card } from '@/components';

interface PrivacySettingsProps {
  profileVisibility: 'Public' | 'Friends Only' | 'Private';
  activitySharing: boolean;
  onProfileVisibilityChange: (value: 'Public' | 'Friends Only' | 'Private') => void;
  onActivitySharingChange: (checked: boolean) => void;
}

export default function PrivacySettings({ 
  profileVisibility, 
  activitySharing,
  onProfileVisibilityChange,
  onActivitySharingChange
}: PrivacySettingsProps) {
  return (
    <Card>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-muted-foreground">
                Who can see your profile and activity
              </p>
            </div>
            <select 
              className="bg-background border border-muted rounded p-2"
              value={profileVisibility}
              onChange={(e) => onProfileVisibilityChange(e.target.value as 'Public' | 'Friends Only' | 'Private')}
            >
              <option value="Public">Public</option>
              <option value="Friends Only">Friends Only</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="font-medium">Activity Sharing</p>
              <p className="text-sm text-muted-foreground">
                Share activities with friends
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={activitySharing}
                onChange={(e) => onActivitySharingChange(e.target.checked)} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </Card>
  );
}
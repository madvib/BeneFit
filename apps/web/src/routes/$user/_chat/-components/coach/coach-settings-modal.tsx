import { Bell, Volume2, Moon } from 'lucide-react';
import { Button, Modal, Switch, typography } from '@/lib/components';

interface CoachSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CoachSettingsModal({ isOpen, onClose }: CoachSettingsModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Coach Settings"
      description="Customize your AI Coach experience."
    >
      <div className="space-y-6 pt-4">
        {/* Section 1: Notifications */}
        <div className="space-y-4">
          <h4 className={typography.labelSm}>Notifications</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-muted-foreground rounded-lg p-2">
                <Bell size={16} />
              </div>
              <div>
                <p className={typography.small}>Push Notifications</p>
                <p className={typography.mutedXs}>Receive updates on your plan.</p>
              </div>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} />
          </div>
        </div>

        {/* Section 2: Appearance */}
        <div className="space-y-4">
          <h4 className={typography.labelSm}>Appearance</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-muted-foreground rounded-lg p-2">
                <Moon size={16} />
              </div>
              <div>
                <p className={typography.small}>Dark Mode</p>
                <p className={typography.mutedXs}>Sync with system settings.</p>
              </div>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} />
          </div>
        </div>

        {/* Section 3: Voice */}
        <div className="space-y-4">
          <h4 className={typography.labelSm}>Voice & Tone</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-muted-foreground rounded-lg p-2">
                <Volume2 size={16} />
              </div>
              <div>
                <p className={typography.small}>Voice Feedback</p>
                <p className={typography.mutedXs}>Hear coach responses.</p>
              </div>
            </div>
            <Switch checked={false} onCheckedChange={() => {}} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

'use client';

import { Award, X } from 'lucide-react';
import { Button } from '@/lib/components';
import { useModalAnimation } from '@/lib/hooks/use-modal-animation';

interface Achievement {
  id: string;
  name: string;
  description?: string;
}

interface AchievementPopupProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementPopup({
  achievements,
  isOpen,
  onClose,
}: AchievementPopupProps) {
  const { isVisible } = useModalAnimation(isOpen);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`bg-card relative w-full max-w-md transform rounded-2xl p-8 shadow-2xl transition-transform duration-500 ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-10 scale-90'}`}
      >
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4"
        >
          <X size={24} />
        </button>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
            <Award size={48} />
          </div>
          <h2 className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
            Achievement Unlocked!
          </h2>
          <p className="text-muted-foreground mt-2">You&apos;ve reached a new milestone.</p>
        </div>

        <div className="mb-8 space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-accent flex items-center gap-4 rounded-xl p-4"
            >
              <div className="bg-background rounded-lg p-2">
                <Award className="text-primary" size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold">{achievement.name}</p>
                <p className="text-muted-foreground text-xs">
                  {achievement.description || 'Great job!'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={onClose} className="w-full" size="lg">
          Awesome!
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Badge, Button, Modal, typography } from '@/lib/components';
import { Award, Trophy, Star } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description?: string;
}

interface AchievementPopupProps {
  achievements: Achievement[];
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementPopup({
  achievements,
  isOpen,
  onClose,
}: Readonly<AchievementPopupProps>) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      showCloseButton={true}
      containerClassName="bg-background/90 ring-border/50 rounded-[32px] p-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1"
      className="p-0"
    >
      <div className="relative overflow-hidden p-6 sm:p-10">
        {/* Background Effects */}
        <div className="pointer-events-none absolute top-0 right-0 left-0 h-40 bg-linear-to-b from-yellow-500/10 to-transparent" />
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-[80px]" />
        <div className="bg-primary/10 absolute -top-24 -right-24 h-64 w-64 rounded-full blur-[80px]" />

        <div className="relative z-10 mb-8 text-center sm:mb-10">
          <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center sm:mb-8 sm:h-32 sm:w-32">
            {/* Glowing Halo */}
            <div className="animate-spin-slow border-warning/50 absolute inset-0 rounded-full border-2 border-dashed" />
            <div className="animate-reverse-spin-slow border-primary/20 absolute inset-2 rounded-full border" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-[20px] bg-linear-to-br from-yellow-500 to-orange-500 text-white shadow-2xl shadow-yellow-500/50 transition-transform duration-700 hover:rotate-6 sm:h-20 sm:w-20 sm:rounded-[24px]">
              <Trophy className="h-8 w-8 drop-shadow-lg sm:h-10 sm:w-10" />
            </div>

            <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-6 w-6 animate-bounce items-center justify-center rounded-full shadow-lg sm:-top-2 sm:-right-2 sm:h-8 sm:w-8">
              <Star size={14} className="fill-current sm:size-4" />
            </div>
          </div>

          <div className={`${typography.labelXs} mb-3 sm:mb-4`}>
            <Badge variant="success">Elite Milestone</Badge>
          </div>
          <h1 className={`${typography.displayLgResponsive} mb-1 sm:mb-2`}>
            Achievement Unlocked
          </h1>
          <p className={`${typography.displaySm} opacity-60`}>
            Precision Intelligence Validation
          </p>
        </div>
        <div className="relative z-10 mb-10 space-y-4">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className="group bg-accent/40 border-border/50 hover:border-primary/30 flex items-center gap-5 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-background group-hover:bg-primary/10 rounded-xl p-3 transition-colors duration-300">
                <Award className="text-primary" size={24} />
              </div>
              <div className="text-left">
                <p className={`${typography.displayBase} mb-1`}>{achievement.name}</p>
                <p className={`${typography.mutedXs} opacity-70`}>
                  {achievement.description || 'Superior performance threshold exceeded.'}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={onClose}
          className={`${typography.p} bg-primary text-primary-foreground shadow-primary/20 h-14 w-full rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95`}
        >
          Acknowledge
        </Button>
      </div>
    </Modal>
  );
}

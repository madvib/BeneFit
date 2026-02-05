import { PanelRightClose, Layout } from 'lucide-react';
import { Button, IconBox, typography } from '@/lib/components';
import {
  RecommendationData,
  MobileOverlay,
  WeeklySynthesisButton,
  SystemContextSection,
  RightPanelFooter,
  RecommendationItem,
} from '../shared';

interface RightActionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: RecommendationData[];
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
}

export default function RightActionPanel({
  isOpen,
  onClose,
  recommendations,
  onGenerateSummary,
  isGeneratingSummary,
}: RightActionPanelProps) {
  return (
    <>
      <MobileOverlay isOpen={isOpen} onClose={onClose} />
      <aside
        className={`bg-background/80 border-border/50 fixed inset-y-0 right-0 z-40 flex h-full w-[320px] transform flex-col border-l backdrop-blur-xl transition-all duration-500 lg:static lg:flex lg:transform-none ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : '-mr-80 w-0 translate-x-80 overflow-hidden border-l-0 opacity-0'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBox icon={Layout} size="sm" variant="default" />
              <div>
                <h4 className={`${typography.h4} text-sm font-bold tracking-tight`}>
                  Coach Actions
                </h4>
                <p className={`${typography.muted} text-[10px] leading-none`}>
                  Tools & Resources
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg transition-all active:scale-90 lg:hidden"
            >
              <PanelRightClose size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg transition-all active:scale-90 max-lg:hidden"
            >
              <PanelRightClose size={16} />
            </Button>
          </div>

          <div className="no-scrollbar flex-1 space-y-8 overflow-y-auto">
            <SystemContextSection />

            <div>
              <div className="mb-4 flex items-center gap-2">
                <p
                  className={`${typography.muted} text-[10px] font-black tracking-widest uppercase`}
                >
                  Suggested Commands
                </p>
                <div className="bg-border/50 h-px flex-1" />
              </div>

              <div className="grid gap-4">
                <WeeklySynthesisButton
                  onGenerateSummary={onGenerateSummary}
                  isGeneratingSummary={isGeneratingSummary}
                />

                {recommendations.slice(0, 3).map((rec, idx) => (
                  <RecommendationItem
                    key={idx}
                    title={rec.title}
                    reason={rec.reason}
                    type={rec.type}
                  />
                ))}
              </div>
            </div>
          </div>

          <RightPanelFooter />
        </div>
      </aside>
    </>
  );
}

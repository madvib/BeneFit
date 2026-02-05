import { Sparkles } from 'lucide-react';
import { typography } from '@/lib/components';
import { RecommendationData } from '../types';

export const AnalysisSection = ({
  recommendations,
  onGenerateSummary,
  isGeneratingSummary,
  RecommendationItem,
}: {
  recommendations: RecommendationData[];
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
  RecommendationItem: React.ComponentType<{ title: string; reason: string; type: string }>;
}) => (
  <div className="p-4">
    <h4 className={`${typography.muted} mb-3 text-[10px] font-black tracking-widest uppercase`}>
      Analysis & Suggestions
    </h4>

    <button
      disabled={isGeneratingSummary}
      onClick={onGenerateSummary}
      className="group bg-card/50 border-border/50 hover:border-primary/40 relative mb-4 w-full rounded-2xl border p-4 text-left transition-all duration-300 hover:shadow-xl disabled:opacity-50"
    >
      <div className="flex items-start gap-4">
        <div className="bg-primary/20 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-2.5 transition-all duration-300">
          <Sparkles size={16} />
        </div>
        <div>
          <p
            className={`${typography.small} group-hover:text-primary text-sm font-black transition-colors`}
          >
            Weekly Synthesis
          </p>
          <p
            className={`${typography.muted} mt-1 text-[10px] leading-tight font-medium opacity-70`}
          >
            Full performance audit via AI.
          </p>
        </div>
      </div>
    </button>

    <div className="space-y-3">
      {recommendations.slice(0, 3).map((rec, idx) => (
        <RecommendationItem key={idx} title={rec.title} reason={rec.reason} type={rec.type} />
      ))}
    </div>
  </div>
);

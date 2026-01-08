import {
  Sparkles,
  Apple,
  BatteryPlus,
  BicepsFlexed,
  PersonStanding,
  PanelRightClose,
} from 'lucide-react';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Core':
    case 'Flexibility':
      return <PersonStanding className="h-4 w-4" />;
    case 'Nutrition':
      return <Apple className="h-4 w-4" />;
    case 'Wellness':
      return <BatteryPlus className="h-4 w-4" />;
    case 'Workout':
      return <BicepsFlexed className="h-4 w-4" />;

    default:
      return <Sparkles className="h-4 w-4" />;
  }
};
interface RecommendationData {
  id: number | string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}
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
    <aside
      className={`border-muted bg-background hidden w-[300px] flex-col border-l transition-all duration-300 lg:flex ${isOpen ? 'mr-0 translate-x-0 opacity-100' : '-mr-[300px] w-0 translate-x-[300px] overflow-hidden border-l-0 opacity-0'} `}
    >
      <div className="flex h-full flex-col p-5">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-foreground flex items-center gap-2 font-semibold">
            <Sparkles size={16} className="text-primary" />
            Suggestions
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <PanelRightClose size={16} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto">
          <div className="bg-accent/50 border-muted/50 rounded-xl border p-4">
            <h4 className="mb-2 text-sm font-medium">Project Context</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              You are currently working on the &quot;Dashboard Redesign&quot;. Accessing
              components from the design system v2.
            </p>
          </div>

          <h4 className="text-muted-foreground mt-6 mb-2 text-xs font-semibold tracking-wider uppercase">
            Quick Actions
          </h4>

          <div className="grid gap-3">
            <button
              disabled={isGeneratingSummary}
              onClick={onGenerateSummary}
              className="border-muted hover:border-primary/50 hover:bg-accent/50 group flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="bg-background border-muted group-hover:border-primary/30 text-muted-foreground group-hover:text-primary mt-1 rounded border p-1.5 transition-colors">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                  Generate Weekly Summary
                </div>
                <div className="text-muted-foreground mt-0.5 text-xs">
                  Get an AI analysis of your progress
                </div>
              </div>
            </button>

            {recommendations.map((rec, idx) => (
              <button
                key={idx}
                className="border-muted hover:border-primary/50 hover:bg-accent/50 group flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-sm"
              >
                <div className="bg-background border-muted group-hover:border-primary/30 text-muted-foreground group-hover:text-primary mt-1 rounded border p-1.5 transition-colors">
                  {getCategoryIcon(rec.category)}
                </div>
                <div>
                  <div className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
                    {rec.title}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">{rec.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-muted mt-auto border-t pt-4">
          <div className="text-muted-foreground text-center text-xs">
            AI can make mistakes. Verify important info.
          </div>
        </div>
      </div>
    </aside>
  );
}

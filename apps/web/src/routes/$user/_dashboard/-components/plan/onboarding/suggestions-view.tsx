

import { EmptyState, typography } from '@/lib/components';
import {
  Sparkles,
  Plus,
  Save,
  Download,
  Zap,
  ArrowRight,
  Clock,
  TrendingUp,
  Tag,
  LayoutTemplate,
} from 'lucide-react';

// --- Types ---
export interface PlanSuggestion {
  id: string;
  name: string;
  difficulty: string;
  duration: string;
  category: string;
}

interface SuggestionsViewProps {
  planSuggestions: PlanSuggestion[];
  onCreatePlan: () => void;
  onSavePlan: () => void;
  onExportPlan: () => void;
}

export function SuggestionsView({
  planSuggestions,
  onCreatePlan,
  onSavePlan,
  onExportPlan,
}: Readonly<SuggestionsViewProps>) {
  return (
    <div className="text-foreground mx-auto max-w-4xl space-y-6 p-4 font-sans md:p-6">
      {/* Section 1: Plan Suggestions */}
      <div className="bg-background border-muted flex flex-col overflow-hidden rounded-xl border shadow-sm">
        {/* Header */}
        <div className="border-muted bg-accent/20 flex items-center gap-2 border-b px-6 py-4">
          <Sparkles size={18} className="text-primary" />
          <h3 className={typography.large}>AI Recommendations</h3>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-1">
          {planSuggestions.map((plan) => (
            <div
              key={plan.id}
              className="group border-muted bg-card hover:border-primary/40 relative flex flex-col rounded-xl border p-5 transition-all duration-200 hover:shadow-md"
            >
              {/* Top Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`${typography.labelXs} bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-md border px-2 py-0.5`}
                >
                  <Tag size={10} /> {plan.category}
                </span>
                <span
                  className={`${typography.muted} bg-muted/50 ml-auto flex items-center gap-1 rounded-full px-2 py-0.5`}
                >
                  <Clock size={10} /> {plan.duration}
                </span>
              </div>

              {/* Title */}
              <h4
                className={`${typography.large} group-hover:text-primary mb-1 transition-colors`}
              >
                {plan.name}
              </h4>

              {/* Difficulty Indicator */}
              <div className={`${typography.muted} mb-6 flex items-center gap-2`}>
                <TrendingUp size={12} />
                <span>
                  Difficulty:{' '}
                  <span className={`${typography.small} text-foreground`}>{plan.difficulty}</span>
                </span>
              </div>

              {/* Action Area */}
              <div className="border-muted/60 mt-auto flex items-center justify-between border-t pt-4">
                <span
                  className={`${typography.muted} group-hover:text-primary transition-colors`}
                >
                  View details
                </span>
                <button className="bg-accent text-foreground group-hover:bg-primary group-hover:text-primary-foreground rounded-full p-2 shadow-sm transition-all">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {planSuggestions.length === 0 && (
            <EmptyState
              icon={LayoutTemplate}
              title="No suggestions available"
              description="No suggestions available at the moment."
              className="col-span-full py-12"
              iconClassName="opacity-20"
            />
          )}
        </div>
      </div>

      {/* Section 2: Plan Actions */}
      <div className="bg-background border-muted overflow-hidden rounded-xl border shadow-sm">
        <div className="border-muted bg-accent/20 flex items-center gap-2 border-b px-6 py-4">
          <Zap size={18} className="text-primary" />
          <h3 className={typography.large}>Quick Actions</h3>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-3">
          {/* Create New */}
          <button
            onClick={onCreatePlan}
            className="border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary group flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center transition-all"
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-sm transition-transform group-hover:scale-110">
              <Plus size={24} />
            </div>
            <div>
              <span
                className={`${typography.small} group-hover:text-primary block transition-colors`}
              >
                Create New Plan
              </span>
              <span className={`${typography.muted} mt-1 block`}>Start from scratch</span>
            </div>
          </button>

          {/* Save Current */}
          <button
            onClick={onSavePlan}
            className="border-muted bg-card hover:border-primary/40 group flex h-full flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm"
          >
            <div className="bg-accent text-muted-foreground group-hover:text-primary rounded-full p-3 transition-colors">
              <Save size={24} />
            </div>
            <div>
              <span className={`${typography.small} block`}>Save Progress</span>
              <span className={`${typography.muted} mt-1 block`}>Save current edits</span>
            </div>
          </button>

          {/* Export */}
          <button
            onClick={onExportPlan}
            className="border-muted bg-card hover:border-primary/40 group flex h-full flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-sm"
          >
            <div className="bg-accent text-muted-foreground group-hover:text-primary rounded-full p-3 transition-colors">
              <Download size={24} />
            </div>
            <div>
              <span className={`${typography.small} block`}>Export Plan</span>
              <span className={`${typography.muted} mt-1 block`}>Download as PDF/CSV</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

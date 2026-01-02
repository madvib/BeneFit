'use client';

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

export default function SuggestionsView({
  planSuggestions,
  onCreatePlan,
  onSavePlan,
  onExportPlan,
}: SuggestionsViewProps) {
  return (
    <div className="text-foreground mx-auto max-w-4xl space-y-6 p-4 font-sans md:p-6">
      {/* Section 1: Plan Suggestions */}
      <div className="bg-background border-muted flex flex-col overflow-hidden rounded-xl border shadow-sm">
        {/* Header */}
        <div className="border-muted bg-accent/20 flex items-center gap-2 border-b px-6 py-4">
          <Sparkles size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">AI Recommendations</h3>
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
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                  <Tag size={10} /> {plan.category}
                </span>
                <span className="text-muted-foreground bg-muted/50 ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                  <Clock size={10} /> {plan.duration}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-foreground group-hover:text-primary mb-1 text-lg font-bold transition-colors">
                {plan.name}
              </h4>

              {/* Difficulty Indicator */}
              <div className="text-muted-foreground mb-6 flex items-center gap-2 text-xs">
                <TrendingUp size={12} />
                <span>
                  Difficulty:{' '}
                  <span className="text-foreground font-medium">{plan.difficulty}</span>
                </span>
              </div>

              {/* Action Area */}
              <div className="border-muted/60 mt-auto flex items-center justify-between border-t pt-4">
                <span className="text-muted-foreground group-hover:text-primary text-xs font-medium transition-colors">
                  View details
                </span>
                <button className="bg-accent text-foreground group-hover:bg-primary group-hover:text-primary-foreground rounded-full p-2 shadow-sm transition-all">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}

          {planSuggestions.length === 0 && (
            <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center py-12 text-center">
              <LayoutTemplate size={48} className="mb-4 opacity-20" />
              <p>No suggestions available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Plan Actions */}
      <div className="bg-background border-muted overflow-hidden rounded-xl border shadow-sm">
        <div className="border-muted bg-accent/20 flex items-center gap-2 border-b px-6 py-4">
          <Zap size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Quick Actions</h3>
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
              <span className="text-foreground group-hover:text-primary block font-semibold transition-colors">
                Create New Plan
              </span>
              <span className="text-muted-foreground mt-1 block text-xs">
                Start from scratch
              </span>
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
              <span className="text-foreground block font-semibold">Save Progress</span>
              <span className="text-muted-foreground mt-1 block text-xs">
                Save current edits
              </span>
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
              <span className="text-foreground block font-semibold">Export Plan</span>
              <span className="text-muted-foreground mt-1 block text-xs">
                Download as PDF/CSV
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

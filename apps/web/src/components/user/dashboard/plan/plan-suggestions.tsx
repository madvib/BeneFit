'use client';

import { Sparkles, Clock, Users, Star, ArrowRight, LayoutTemplate } from 'lucide-react';
import { PlanSuggestion } from './types';
import { Card } from '@/components/common/ui-primitives/card/card';

interface PlanSuggestionsProps {
  suggestions: PlanSuggestion[];
  onSelectPlan: (planId: string) => void;
}

export default function PlanSuggestions({ suggestions, onSelectPlan }: PlanSuggestionsProps) {
  return (
    <Card
      title="Suggested for You"
      icon={Sparkles}
      className="h-full border-border/50 bg-card shadow-sm"
      headerClassName="border-b border-border/50"
      headerAction={
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      }
    >
      <div className="space-y-4">
        {suggestions.map((plan) => (
          <div
            key={plan.id}
            className="group flex items-start gap-4 rounded-2xl border border-border p-4 transition-all hover:border-primary/30 hover:bg-accent/5 hover:shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl">
              {plan.image}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {plan.title}
                  </h4>
                  <p className="text-xs font-medium text-muted-foreground">{plan.category}</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  <Star size={10} className="fill-current" />
                  {plan.rating}
                </div>
              </div>

              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {plan.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {plan.users}
                </span>
              </div>

              <button
                onClick={() => onSelectPlan(plan.id)}
                className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                View Plan <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-accent/5 py-12 text-center text-muted-foreground">
            <LayoutTemplate size={32} className="mb-3 opacity-20" />
            <p className="text-sm">No suggestions available.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

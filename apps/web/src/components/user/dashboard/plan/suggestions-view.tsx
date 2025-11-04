'use client';

import { Card } from '@/components';
import { PlanSuggestion } from '@/controllers';

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
    <div>
      <Card title="Plan Suggestions" className="mb-8">
        <div className="space-y-4">
          {planSuggestions.map((plan) => (
            <div
              key={plan.id}
              className="p-4 bg-background rounded-lg border border-muted"
            >
              <h4 className="font-medium">{plan.name}</h4>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {plan.difficulty}
                </span>
                <span className="text-xs text-muted-foreground">{plan.duration}</span>
                <span className="text-xs text-muted-foreground">{plan.category}</span>
              </div>
              <button className="mt-3 w-full btn btn-ghost btn-sm">Preview</button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Plan Actions">
        <div className="space-y-3">
          <button className="w-full btn btn-primary" onClick={onCreatePlan}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create New Plan
          </button>
          <button className="w-full btn btn-ghost" onClick={onSavePlan}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Save Current Plan
          </button>
          <button className="w-full btn btn-ghost" onClick={onExportPlan}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2H16a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Export Plan
          </button>
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Sparkles, Layout, Dumbbell, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Button, typography } from '@/lib/components';
import { fitnessPlan } from '@bene/react-api-client';
import GoalSelectionForm from './goal-selection-form';

interface PlanOnboardingProps {
  onGenerate: (_request: fitnessPlan.GeneratePlanRequest) => void;
  onBrowse: () => void;
  isLoading?: boolean;
}

export default function PlanOnboarding({ onGenerate, onBrowse, isLoading }: PlanOnboardingProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);

  if (showGoalForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 container mx-auto max-w-3xl p-6 py-12 duration-500">
        <GoalSelectionForm onGenerate={onGenerate} isLoading={isLoading} />

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowGoalForm(false)}
            className={`${typography.muted} hover:text-foreground underline`}
            disabled={isLoading}
          >
            ← Back to options
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      {/* Hero Section */}
      <div className="relative mb-6 text-center">
        <div className="bg-primary/20 absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl" />

        <div
          className={`bg-background border-muted mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${typography.small} shadow-sm`}
        >
          <Sparkles size={16} className="text-primary animate-pulse" />
          <span className="text-foreground">AI-Powered Training</span>
        </div>

        <h1 className={`${typography.displayLgResponsive} text-foreground mb-6`}>
          Everything you need <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            for your next peak.
          </span>
        </h1>

        <p className={`${typography.lead} text-muted-foreground mx-auto max-w-xl`}>
          Start your transformation today with a personalized fitness plan tailored to your goals,
          equipment, and schedule.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* AI Generation Card */}
        <div className="group relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5 p-8 transition-all hover:border-blue-500/40 hover:shadow-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Zap size={32} />
          </div>

          <h3 className={`${typography.h3} text-foreground mb-3`}>Generate with AI</h3>
          <p className={`${typography.p} text-muted-foreground mb-8 leading-relaxed`}>
            Our AI coach analyzes your profile and goals to create a high-performance routine that
            adapts to your progress.
          </p>

          <Button
            onClick={() => setShowGoalForm(true)}
            isLoading={isLoading}
            className={`${typography.large} flex w-full items-center justify-center gap-2 rounded-2xl py-7 transition-transform active:scale-95`}
          >
            Create My Plan <ArrowRight size={20} />
          </Button>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className={`flex items-center gap-1.5 ${typography.mutedXs} text-blue-500/70`}>
              <Target size={14} /> Goal-Oriented
            </div>
            <div className={`flex items-center gap-1.5 ${typography.mutedXs} text-purple-500/70`}>
              <Layout size={14} /> Custom Schedule
            </div>
          </div>
        </div>

        {/* Browse Templates Card */}
        <div className="group border-border bg-background hover:border-muted-foreground/30 relative overflow-hidden rounded-3xl border p-8 transition-all hover:shadow-lg">
          <div className="bg-muted text-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Dumbbell size={32} />
          </div>

          <h3 className={`${typography.h3} text-foreground mb-3`}>Browse Programs</h3>
          <p className={`${typography.p} text-muted-foreground mb-8 leading-relaxed`}>
            Choose from a collection of tried-and-true training programs designed by professional
            athletes and coaches.
          </p>

          <Button
            onClick={onBrowse}
            variant="outline"
            className={`${typography.large} flex w-full items-center justify-center gap-2 rounded-2xl py-7`}
          >
            Explore Library <Layout size={20} />
          </Button>

          <div className="mt-6 flex flex-wrap gap-4">
            <div
              className={`text-muted-foreground flex items-center gap-1.5 ${typography.mutedXs}`}
            >
              <ShieldCheck size={14} /> Athlete Approved
            </div>
            <div
              className={`text-muted-foreground flex items-center gap-1.5 ${typography.mutedXs}`}
            >
              <Sparkles size={14} /> Pure Science
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Footer info */}
      <p className={`${typography.muted} mt-8`}>
        Join over <span className={`${typography.small} text-foreground font-bold`}>10,000+</span>{' '}
        athletes reaching their potential.
      </p>
    </div>
  );
}

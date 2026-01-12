'use client';

import { CreditCard, Check, Sparkles } from 'lucide-react';
import { Card, Button, PageHeader, SectionHeader, typography } from '@/lib/components';

export default function BillingView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and payment methods"
      />

      {/* Current Plan */}
      <Card className="border-primary/20 overflow-hidden">
        <div className="bg-primary/5 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className={`${typography.labelSm} text-primary mb-1`}>Current Plan</div>
              <h2 className={typography.h2}>Free Tier</h2>
              <p className={`${typography.p} text-muted-foreground`}>
                Basic access to all features
              </p>
            </div>
            <Button variant="gradient">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </div>
        <div className="space-y-3 p-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
              <Check size={14} />
            </div>
            <span className={typography.p}>Basic Analytics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
              <Check size={14} />
            </div>
            <span className={typography.p}>5 Projects</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
              <Check size={14} />
            </div>
            <span className={typography.p}>Community Support</span>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <SectionHeader
          title="Payment Methods"
          action={
            <Button variant="outline" size="sm">
              Add Method
            </Button>
          }
        />

        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-16 shrink-0 items-center justify-center rounded-lg">
                <CreditCard size={24} />
              </div>
              <div className="min-w-0">
                <div className={`${typography.h4} truncate`}>Visa ending in 4242</div>
                <div className={`${typography.mutedXs} text-muted-foreground`}>Expires 12/24</div>
              </div>
            </div>
            <div
              className={`${typography.xs} bg-primary text-primary-foreground ml-auto rounded-full px-3 py-1 font-semibold sm:ml-0`}
            >
              Default
            </div>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <SectionHeader title="Billing History" />
        <div className="bg-muted/30 text-muted-foreground rounded-lg py-12 text-center">
          No billing history available
        </div>
      </Card>
    </div>
  );
}

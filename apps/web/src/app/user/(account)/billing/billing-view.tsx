'use client';

import { CreditCard, Check, Sparkles } from 'lucide-react';
import { PageHeader } from '../_shared/page-header';
import { Card, Button } from '@/lib/components';

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
              <div className="text-primary mb-1 text-sm font-semibold tracking-wider uppercase">
                Current Plan
              </div>
              <h2 className="text-2xl font-bold">Free Tier</h2>
              <p className="text-muted-foreground">Basic access to all features</p>
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
            <span className="font-medium">Basic Analytics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
              <Check size={14} />
            </div>
            <span className="font-medium">5 Projects</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full">
              <Check size={14} />
            </div>
            <span className="font-medium">Community Support</span>
          </div>
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Payment Methods</h3>
          <Button variant="outline" size="sm">
            Add Method
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-16 shrink-0 items-center justify-center rounded-lg">
                <CreditCard size={24} />
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">Visa ending in 4242</div>
                <div className="text-muted-foreground text-sm">Expires 12/24</div>
              </div>
            </div>
            <div className="bg-primary text-primary-foreground ml-auto rounded-full px-3 py-1 text-xs font-semibold sm:ml-0">
              Default
            </div>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-semibold">Billing History</h3>
        <div className="bg-muted/30 text-muted-foreground rounded-lg py-12 text-center">
          No billing history available
        </div>
      </Card>
    </div>
  );
}

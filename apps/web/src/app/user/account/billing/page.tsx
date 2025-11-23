'use client';

import { Card, Button } from '@/components';
import { CreditCard, Check } from 'lucide-react';
import { PageHeader } from '@/components/user/account/shared/page-header';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and payment methods"
      />

      {/* Current Plan */}
      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-primary/5 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="text-primary mb-1 text-sm font-semibold tracking-wider uppercase">
                Current Plan
              </div>
              <h2 className="text-2xl font-bold">Free Tier</h2>
              <p className="text-muted-foreground">Basic access to all features</p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Upgrade Plan
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={18} />
              <span>Basic Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={18} />
              <span>5 Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-500" size={18} />
              <span>Community Support</span>
            </div>
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

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-muted flex h-10 w-14 items-center justify-center rounded">
                <CreditCard size={24} />
              </div>
              <div>
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-muted-foreground text-sm">Expires 12/24</div>
              </div>
            </div>
            <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
              Default
            </div>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-semibold">Billing History</h3>
        <div className="text-muted-foreground py-8 text-center">
          No billing history available
        </div>
      </Card>
    </div>
  );
}

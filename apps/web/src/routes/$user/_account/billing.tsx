import { createFileRoute } from '@tanstack/react-router';
import { CreditCard, Check, Sparkles } from 'lucide-react';
import { Button, Card, EmptyState, IconBox, PageHeader, SectionHeader, typography } from '@/lib/components';

export const Route = createFileRoute('/$user/_account/billing')({
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and payment methods"
        align="left"
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
            <IconBox icon={Check} variant="default" size="sm" />
            <span className={typography.p}>Basic Analytics</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconBox icon={Check} variant="default" size="sm" />
            <span className={typography.p}>5 Projects</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconBox icon={Check} variant="default" size="sm" />
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
              <IconBox
                icon={CreditCard}
                variant="default"
                size="lg"
                className="w-16 rounded-lg"
              />
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
        <EmptyState
          icon={CreditCard}
          title="No billing history available"
          description=""
          className="bg-muted/30 rounded-lg py-12"
          iconClassName="opacity-20"
        />
      </Card>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { CreditCard, Check, Sparkles, Settings, Loader2 } from 'lucide-react';
import { Button, Card, EmptyState, IconBox, PageHeader, SectionHeader, typography } from '@/lib/components';
import { useBillingStatus, useCreateCheckout, useCreatePortalSession } from '@bene/react-api-client';

export const Route = createFileRoute('/$user/_account/billing')({
  component: BillingPage,
});

const FREE_FEATURES = ['Basic workout tracking', 'Manual plan creation', 'Community support'];
const PRO_FEATURES = [
  'AI-powered plan generation',
  'AI coaching chat',
  'Advanced analytics',
  'Strava integration',
  'Priority support',
];

function BillingPage() {
  const { data: billing, isLoading } = useBillingStatus();
  const checkout = useCreateCheckout();
  const portal = useCreatePortalSession();

  const isPro = billing?.plan === 'pro';

  const handleUpgrade = () => {
    checkout.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
      },
    });
  };

  const handleManage = () => {
    portal.mutate(undefined, {
      onSuccess: (data) => {
        if (data.url) window.location.href = data.url;
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

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
              <h2 className={typography.h2}>{isPro ? 'Pro' : 'Free'}</h2>
              <p className={`${typography.p} text-muted-foreground`}>
                {isPro ? 'Full access to all features' : 'Basic access to features'}
              </p>
              {isPro && billing?.currentPeriodEnd && (
                <p className={`${typography.mutedXs} text-muted-foreground mt-1`}>
                  {billing.cancelAtPeriodEnd ? 'Cancels' : 'Renews'}{' '}
                  {new Date(billing.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {isPro ? (
              <Button variant="outline" onClick={handleManage} disabled={portal.isPending}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Subscription
              </Button>
            ) : (
              <Button variant="gradient" onClick={handleUpgrade} disabled={checkout.isPending}>
                <Sparkles className="mr-2 h-4 w-4" />
                {checkout.isPending ? 'Redirecting...' : 'Upgrade to Pro'}
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-3 p-6">
          {(isPro ? PRO_FEATURES : FREE_FEATURES).map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <IconBox icon={Check} variant="default" size="sm" />
              <span className={typography.p}>{feature}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Manage Billing (Pro only) */}
      {isPro && (
        <Card className="p-6">
          <SectionHeader
            title="Payment & Invoices"
            action={
              <Button variant="outline" size="sm" onClick={handleManage} disabled={portal.isPending}>
                Open Billing Portal
              </Button>
            }
          />
          <p className={`${typography.p} text-muted-foreground`}>
            View invoices, update payment methods, and manage your subscription through Stripe's
            secure billing portal.
          </p>
        </Card>
      )}

      {/* Empty billing history for free users */}
      {!isPro && (
        <Card className="p-6">
          <SectionHeader title="Billing History" />
          <EmptyState
            icon={CreditCard}
            title="No billing history"
            description="Upgrade to Pro to get started"
            className="bg-muted/30 rounded-lg py-12"
            iconClassName="opacity-20"
          />
        </Card>
      )}
    </div>
  );
}

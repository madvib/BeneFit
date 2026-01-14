'use client';

import { Badge, Button, IconBox, Modal, typography, useAppForm } from '@/lib/components';
import { MessageSquare, Sparkles } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import { CheckInFormSchema } from '@bene/shared';

// TODO use domain schema for this?
interface CheckIn {
  id: string;
  question: string;
  triggeredBy?: string;
}

interface CheckInModalProps {
  checkIn: CheckIn;
  isOpen: boolean;
  onRespond: (_checkInId: string, _response: string) => Promise<void>;
  onDismiss: (_checkInId: string) => void;
  isLoading: boolean;
}

export default function CheckInModal({
  checkIn,
  isOpen,
  onRespond,
  onDismiss,
  isLoading,
}: CheckInModalProps) {
  const form = useAppForm({
    defaultValues: {
      response: '',
    },
    validators: {
      onDynamic: CheckInFormSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await onRespond(checkIn.id, value.response);
      form.reset();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onDismiss(checkIn.id)}
      size="lg"
      showCloseButton={true}
      className="p-0"
    >
      <form.AppForm>
        <div className="relative">
          {/* Header */}
          <div className="border-border/50 flex items-start justify-between border-b p-6">
            <div className="flex items-center gap-4">
              <IconBox
                icon={MessageSquare}
                variant="ghost"
                size="lg"
                className="from-primary to-primary/60 text-primary-foreground shadow-primary/20 rounded-2xl bg-linear-to-br shadow-lg"
                iconClassName="fill-current"
              />
              <div>
                <h3 className={`${typography.h4} text-foreground font-bold`}>Coach Check-In</h3>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${typography.mutedXs} border-primary/20 bg-background/50`}
                  >
                    {checkIn.triggeredBy ? (
                      <>
                        <Sparkles size={10} className="text-primary mr-1 inline-block" />
                        {checkIn.triggeredBy}
                      </>
                    ) : (
                      'Routine Check-In'
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-8">
            {/* Question */}
            <div className="bg-muted/50 relative mb-8 rounded-2xl p-6">
              {/* eslint-disable-next-line no-restricted-syntax */}
              <div className="text-primary/10 absolute -top-3 -left-2 text-6xl select-none">
                “
              </div>  
              <h3
                className={`${typography.large} text-foreground/90 relative z-10 leading-relaxed`}
              >
                {checkIn.question}
              </h3>
            </div>

            <form.Root>
              <form.AppField name="response">
                {(field) => (
                  <div className="mb-8">
                    <label className={`${typography.mutedXs} mb-3 block`}>Your Response</label>
                    <textarea
                      className={`${typography.small} border-input bg-background/50 ring-offset-background placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-primary/20 min-h-35 w-full resize-none rounded-xl border p-4 shadow-sm transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
                      placeholder="Share your thoughts..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                    />
                    {field.state.meta.errors ? (
                      <p
                        className={`${typography.small} text-destructive animate-in slide-in-from-top-1 mt-2 font-medium`}
                      >
                        {field.state.meta.errors.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.AppField>

              <div className="border-border flex items-center justify-end gap-3 border-t pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => onDismiss(checkIn.id)}
                  disabled={isLoading}
                  className={`${typography.muted} hover:text-foreground`}
                >
                  Remind Me Later
                </Button>
                <div className="min-w-35">
                  <form.SubmitButton label="Send Response" />
                </div>
              </div>
            </form.Root>
          </div>
        </div>
      </form.AppForm>
    </Modal>
  );
}

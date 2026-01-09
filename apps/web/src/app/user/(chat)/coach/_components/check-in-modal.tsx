'use client';

import { Button, Card } from '@/lib/components';
import { CheckInFormSchema } from '@bene/shared';
import { MessageSquare, X } from 'lucide-react';
import { revalidateLogic } from '@tanstack/react-form';
import { useAppForm } from '@/lib/components/app-form';

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

  if (!isOpen || !checkIn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <Card className="bg-card animate-in fade-in zoom-in w-full max-w-lg shadow-2xl duration-300">
        <form.AppForm>
          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Coach Check-In</h2>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">
                    {checkIn.triggeredBy
                      ? `Triggered by ${checkIn.triggeredBy}`
                      : 'Routine Check-In'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(checkIn.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-accent/50 border-border mb-6 rounded-xl border p-4">
              <p className="text-lg leading-relaxed font-medium">{checkIn.question}</p>
            </div>

            <form.Root>
              <form.AppField name="response">
                {(field) => (
                  <div>
                    <textarea
                      className="border-input bg-background focus:ring-primary/20 min-h-[120px] w-full resize-none rounded-xl border p-4 transition-all focus:ring-2"
                      placeholder="Type your response here..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                      autoFocus
                    />
                    {field.state.meta.errors ? (
                      <p className="text-destructive mt-1 text-sm">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}
              </form.AppField>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onDismiss(checkIn.id)}
                  disabled={isLoading}
                >
                  Remind Me Later
                </Button>
                <form.SubmitButton label="Send Response" />
              </div>
            </form.Root>
          </div>
        </form.AppForm>
      </Card>
    </div>
  );
}

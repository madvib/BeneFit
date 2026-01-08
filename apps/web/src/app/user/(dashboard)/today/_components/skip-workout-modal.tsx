'use client';

import { useState } from 'react';
import { Button, Card } from '@/lib/components';
import { X } from 'lucide-react';

interface SkipWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_reason: string, _notes?: string) => void;
  isLoading?: boolean;
}

const SKIP_REASONS = [
  { value: 'injury', label: 'Injury or Pain' },
  { value: 'illness', label: 'Feeling Ill' },
  { value: 'fatigue', label: 'Too Fatigued' },
  { value: 'time', label: 'No Time Today' },
  { value: 'travel', label: 'Traveling' },
  { value: 'rest', label: 'Need Extra Rest' },
  { value: 'other', label: 'Other' },
];

export default function SkipWorkoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: SkipWorkoutModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason, notes || undefined);
      setSelectedReason('');
      setNotes('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Skip Today&apos;s Workout</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          <p className="text-muted-foreground mb-6 text-sm">
            Let us know why you&apos;re skipping today. This helps us adjust your plan
            accordingly.
          </p>

          <div className="mb-6 space-y-3">
            <label className="text-sm font-medium">Reason for skipping:</label>
            <div className="space-y-2">
              {SKIP_REASONS.map((reason) => (
                <label key={reason.value} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="skipReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4"
                    disabled={isLoading}
                  />
                  <span className="text-sm">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Additional notes (optional):</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-input bg-background w-full rounded-md border p-3 text-sm"
              rows={3}
              placeholder="Any additional details..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedReason || isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              Skip Workout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

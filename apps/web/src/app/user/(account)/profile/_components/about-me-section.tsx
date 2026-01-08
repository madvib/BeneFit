'use client';

import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Button } from '@/lib/components';

interface AboutMeSectionProps {
  aboutMe: string;
  onChange: (_value: string) => void;
}

export default function AboutMeSection({ aboutMe, onChange }: AboutMeSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(aboutMe);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(aboutMe);
    setIsEditing(false);
  };

  return (
    <div className="group relative mx-auto max-w-xl text-center">
      <div className="mb-3 flex items-center justify-center gap-2">
        <h3 className="text-lg font-semibold">About Me</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Edit Bio"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-muted/30 focus-within:bg-muted/50 focus-within:ring-ring relative rounded-2xl p-1 text-left transition-all focus-within:ring-2 focus-within:ring-offset-1">
          <textarea
            className="bg-background placeholder:text-muted-foreground flex min-h-[140px] w-full resize-none rounded-xl border-0 p-4 text-center text-sm shadow-sm focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us a bit about your fitness journey, goals, or what makes you tick..."
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            maxLength={500}
            autoFocus
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset dark:ring-white/10" />

          <div className="mt-2 flex justify-end gap-2 px-1 pb-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 w-8 rounded-full p-0"
            >
              <X size={16} />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 rounded-full bg-green-600 p-0 text-white hover:bg-green-700"
            >
              <Check size={16} />
            </Button>
          </div>
          <span className="text-muted-foreground absolute top-2 right-3 text-xs opacity-50">
            {tempValue.length}/500
          </span>
        </div>
      ) : (
        <div
          className="relative min-h-[60px] cursor-pointer rounded-xl border border-transparent px-4 py-2 transition-all hover:border-dashed hover:border-black/10 dark:hover:border-white/10"
          onClick={() => setIsEditing(true)}
        >
          <p className="text-muted-foreground leading-relaxed">
            {aboutMe || (
              <span className="text-muted-foreground flex flex-col items-center gap-2 py-4 italic">
                <span className="bg-accent text-accent-foreground flex h-10 w-10 items-center justify-center rounded-full">
                  <Pencil size={16} />
                </span>
                Click to write a short bio about your fitness journey...
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

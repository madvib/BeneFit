'use client';

import { useState } from 'react';
import { Pencil, Check, X, Quote } from 'lucide-react';
import { Button, Card, Typography } from '@/lib/components';

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
    <div className="mx-auto max-w-xl px-4 text-center">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Typography variant="h3" className="text-lg font-bold">
          About Me
        </Typography>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-muted-foreground hover:text-primary h-8 w-8 rounded-full p-0"
            title="Edit Bio"
          >
            <Pencil size={14} />
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card className="border-primary/20 bg-background ring-primary/5 relative overflow-hidden shadow-lg ring-4 transition-all">
          <textarea
            className="placeholder:text-muted-foreground flex min-h-[140px] w-full resize-none bg-transparent p-6 text-center text-base leading-relaxed focus:outline-none"
            placeholder="Tell us a bit about your fitness journey, goals, or what makes you tick..."
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            maxLength={500}
            autoFocus
          />

          <div className="border-border bg-muted/20 flex items-center justify-between border-t px-4 py-2">
            <span className="text-muted-foreground text-xs font-medium">
              {tempValue.length}/500
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full p-0"
              >
                <X size={16} />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full p-0"
              >
                <Check size={16} />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div
          className="group hover:bg-muted/50 relative cursor-pointer rounded-2xl border border-transparent px-6 py-4 transition-all"
          onClick={() => setIsEditing(true)}
        >
          {aboutMe ? (
            <div className="relative">
              <Quote
                size={24}
                className="text-primary/10 absolute -top-2 -left-4 -scale-x-100 transform"
              />
              <Typography variant="p" className="text-muted-foreground leading-relaxed italic">
                {aboutMe}
              </Typography>
              <Quote size={24} className="text-primary/10 absolute -right-4 -bottom-2" />
            </div>
          ) : (
            <div className="text-muted-foreground/50 group-hover:text-muted-foreground flex flex-col items-center gap-3 py-6 transition-colors">
              <div className="bg-muted/50 flex h-12 w-12 items-center justify-center rounded-full">
                <Pencil size={20} />
              </div>
              <Typography variant="small" className="italic">
                Click to write a short bio about your fitness journey...
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



import { Button, typography } from '@/lib/components';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Paperclip, Send, Wand2 } from 'lucide-react';

export interface ChatInputProps {
  onSend: (_message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  startEnhancer?: React.ReactNode;
}

export function ChatInput({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
  className,
  startEnhancer,
}: Readonly<ChatInputProps>) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea  TODO surely this is a hook that should be used in multiple places
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() === '' || disabled) return;
    onSend(input);
    setInput('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`relative w-full max-w-3xl mx-auto ${className || ''}`}>
      <div className="bg-background/80 border-border/50 ring-border/20 focus-within:border-primary/50 focus-within:ring-primary/20 relative flex items-end gap-3 rounded-3xl border p-2.5 shadow-2xl ring-1 backdrop-blur-xl transition-all">
        
        {startEnhancer || (
           <Button
             variant="ghost"
             size="sm"
             disabled={disabled}
             className="text-muted-foreground hover:bg-primary/20 hover:text-primary mb-1 self-end rounded-2xl p-2.5 transition-all active:scale-90 disabled:opacity-50"
           >
             <Paperclip size={20} />
           </Button>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`${typography.small} text-foreground placeholder:text-muted-foreground/50 no-scrollbar max-h-[150px] min-h-12 flex-1 resize-none scroll-py-2 border-none bg-transparent p-3.5 leading-relaxed focus:ring-0 focus:outline-none`}
          rows={1}
        />

        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          disabled={!input.trim() || disabled}
          className={`group mb-1 rounded-2xl h-auto p-3 transition-all duration-300 ${
            input.trim() && !disabled
              ? 'bg-primary text-primary-foreground shadow-[0_4px_15px_-3px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95 hover:bg-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted'
          }`}
        >
          {input.trim() ? (
            <Send
              size={20}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          ) : (
            <Wand2 size={20} />
          )}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className={`${typography.mutedXs} mt-4 opacity-50`}>
          AI can make errors. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

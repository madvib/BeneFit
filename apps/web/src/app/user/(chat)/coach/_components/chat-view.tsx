'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Sparkles, Wand2 } from 'lucide-react';
import { Badge, Button, typography } from '@/lib/components';
import ChatMessage from './chat-message';
import type { MessageData } from './types';

interface ChatViewProps {
  messages: MessageData[];
  onSendMessage: (_content: string) => void;
  isTyping?: boolean;
}

// ChatView Component
export default function ChatView({ messages, onSendMessage, isTyping = false }: ChatViewProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // TODO extract into reusable hook, or existing chat hook.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <main className="bg-background relative flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      {/* Background patterns TODO extract background patterns into component library*/}
      <div
        className="bg-primary/5 pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(var(--primary), 0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Messages List (Scrollable) */}
      <div className="no-scrollbar relative z-0 flex-1 overflow-y-auto scroll-smooth p-4 md:p-8">
        <div className="mx-auto flex max-w-3xl flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-10">
                <div className="bg-primary/20 absolute -inset-6 animate-pulse rounded-full opacity-50 blur-3xl" />
                <div className="from-primary to-primary/60 text-primary-foreground relative rounded-3xl bg-linear-to-br p-8 shadow-2xl transition-transform duration-500 hover:scale-105">
                  <Sparkles size={48} className="animate-pulse" />
                </div>
              </div>
              <Badge variant="success" className={`${typography.mutedXs} mb-4`}>
                AI Coach Active
              </Badge>
              <h1 className={`${typography.displayLgResponsive} mb-4 italic`}>
                Elite Intelligence
              </h1>
              <p className={`${typography.muted} mb-12 max-w-sm`}>
                Your AI coach is calibrated and ready. Ask for training optimizations, diet
                protocols, or performance breakdowns.
              </p>

              <div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  'How can I improve my squat depth?',
                  "What's the best protocol for fat loss?",
                  'Analyze my recent workout volume.',
                  'Adjust my plan for more recovery.',
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className={`${typography.labelXs} bg-accent/40 hover:bg-accent ring-border/50 rounded-2xl p-4 text-left ring-1 transition-all hover:-translate-y-1 active:scale-95`}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isTyping && (
                <div className="flex w-full justify-start py-4">
                  <div
                    className={`${typography.small} bg-accent/50 text-primary ring-border/50 flex max-w-[80%] items-center gap-1.5 rounded-2xl rounded-tl-none px-5 py-3.5 ring-1`}
                  >
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current"></span>
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-150"></span>
                    <span className="block h-1.5 w-1.5 animate-bounce rounded-full bg-current delay-300"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-8" />
            </>
          )}
        </div>
      </div>

      {/* Input Area (Fixed at bottom) */}
      <div className="from-background via-background z-10 shrink-0 bg-linear-to-t to-transparent p-6 pt-0">
        <div className="mx-auto max-w-3xl">
          {/* Input Container */}
          <div className="bg-background/80 border-border/50 ring-border/20 focus-within:border-primary/50 focus-within:ring-primary/20 relative flex items-end gap-3 rounded-3xl border p-2.5 shadow-2xl ring-1 backdrop-blur-xl transition-all">
            <button
              type="button"
              className="bg-accent/50 text-muted-foreground hover:bg-primary/20 hover:text-primary mb-1 self-end rounded-2xl p-2.5 transition-all active:scale-90"
            >
              <Paperclip size={20} />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="Message Coach..."
              className={`${typography.small} text-foreground placeholder:text-muted-foreground/50 no-scrollbar max-h-[150px] min-h-12 flex-1 resize-none scroll-py-2 border-none bg-transparent p-3.5 leading-relaxed focus:ring-0`}
              rows={1}
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!input.trim()}
              className={`group mb-1 rounded-2xl p-3 transition-all duration-300 ${
                input.trim()
                  ? 'bg-primary text-primary-foreground shadow-[0_4px_15px_-3px_rgba(var(--primary),0.6)] hover:scale-105 active:scale-95'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
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
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className={`${typography.mutedXs} mt-4 opacity-50`}>
              AgentUI can make errors. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

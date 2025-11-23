'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';
import { MessageData } from '@/controllers/coach';
import ChatMessage from './chat-message';

interface ChatViewProps {
  messages: MessageData[];
  onSendMessage: (_content: string) => void;
}

// ChatView Component
export default function ChatView({ messages, onSendMessage }: ChatViewProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <main className="bg-background relative flex min-w-0 flex-1 flex-col">
      {/* Messages List (Scrollable) */}
      <div className="no-scrollbar flex-1 overflow-y-auto scroll-smooth p-4 md:p-6">
        <div className="mx-auto flex max-w-3xl flex-col">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area (Fixed at bottom of main column) */}
      <div className="from-background via-background z-10 shrink-0 bg-linear-to-t to-transparent p-4 pt-0">
        <div className="mx-auto max-w-3xl">
          {/* Input Container */}
          <div className="bg-accent/50 border-muted focus-within:border-ring/50 focus-within:ring-ring/30 relative flex items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all focus-within:ring-1">
            <button className="text-muted-foreground hover:text-primary hover:bg-muted mb-1 self-end rounded-xl p-2 transition-colors">
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
              placeholder="Message Agent..."
              className="text-foreground placeholder:text-muted-foreground/70 no-scrollbar max-h-[150px] min-h-11 flex-1 resize-none scroll-py-2 border-none bg-transparent p-3 text-base leading-normal focus:ring-0"
              rows={1}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!input.trim()}
              className={`mb-1 rounded-xl p-2 transition-all duration-200 ${
                input.trim()
                  ? 'bg-primary text-primary-foreground shadow-md hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {input.trim() ? <Send size={18} /> : <Mic size={18} />}
            </button>
          </div>

          <div className="mt-2 text-center">
            <p className="text-muted-foreground text-[10px]">
              AgentUI can make errors. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

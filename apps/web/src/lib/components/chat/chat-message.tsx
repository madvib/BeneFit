import { User, Sparkles, type LucideIcon } from 'lucide-react';
import { IconBox, typography } from '@/lib/components';

export interface ChatMessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: Date;
  avatarIcon?: LucideIcon;
  senderName?: string;
  className?: string;
}

export function ChatMessage({
  content,
  role,
  timestamp,
  avatarIcon,
  senderName,
  className,
}: Readonly<ChatMessageProps>) {
  const isUser = role === 'user';
  const DefaultIcon = isUser ? User : Sparkles;
  const Icon = avatarIcon || DefaultIcon;
  const defaultSenderName = senderName || (isUser ? 'You' : 'Assistant');

  return (
    <div
      className={`animate-in slide-in-from-bottom-2 mb-6 flex w-full duration-300 ${isUser ? 'justify-end' : 'justify-start'} ${className || ''}`}
    >
      <div
        className={`flex max-w-[85%] gap-4 md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <IconBox
          icon={Icon}
          variant="ghost"
          size="md"
          className={`group ring-border/50 rounded-2xl shadow-lg ring-1 transition-transform active:scale-95 shrink-0 ${
            isUser
              ? 'from-primary to-primary/80 text-primary-foreground bg-linear-to-br'
              : 'bg-accent/80 text-primary backdrop-blur-sm'
          }`}
          iconClassName={isUser ? '' : 'animate-pulse'}
        />

        {/* Bubble & Metadata */}
        <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="mb-0.5 flex items-center gap-2 px-0.5">
            <p className={`${typography.mutedXs} text-muted-foreground/50 font-black tracking-widest uppercase`}>
              {defaultSenderName}
            </p>
            {timestamp && (
              <>
                <div className="bg-border h-1 w-1 rounded-full" />
                <p className={`${typography.mutedXs} text-muted-foreground/40 font-bold`}>
                  {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </>
            )}
          </div>

          <div
            className={`relative rounded-3xl px-6 py-5 shadow-xl transition-all hover:shadow-2xl text-left break-words ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-[0_10px_30px_-10px_rgba(var(--primary),0.3)]'
                : 'bg-accent/40 border-border/50 text-foreground rounded-tl-none border backdrop-blur-md'
            }`}
          >
            <p
              className={`text-sm leading-relaxed font-medium whitespace-pre-wrap ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}
            >
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

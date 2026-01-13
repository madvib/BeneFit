import { User, Sparkles } from 'lucide-react';
import type { MessageData } from './types';
import { typography, IconBox } from '@/lib/components';
export default function ChatMessage({ message }: { message: MessageData }) {
  const isUser = message.role === 'user';
  // TODO should probably have a chatmessage primitive and keep this coach specific
  return (
    <div
      className={`animate-in slide-in-from-bottom-2 mb-8 flex w-full duration-300 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`flex max-w-[85%] gap-4 md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar  // TODO could use iconbox here*/}

        <IconBox
          icon={isUser ? User : Sparkles}
          variant="ghost"
          size="md"
          className={`group ring-border/50 rounded-2xl shadow-lg ring-1 transition-transform active:scale-95 ${
            isUser
              ? 'from-primary to-primary/80 text-primary-foreground bg-linear-to-br'
              : 'bg-accent/80 text-primary backdrop-blur-sm'
          }`}
          iconClassName={isUser ? '' : 'animate-pulse'}
        />

        {/* Bubble & Metadata */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}>
          <div className={`mb-0.5 flex items-center gap-2 px-0.5`}>
            <p
              className={`${typography.muted} text-muted-foreground/50 text-[10px] font-black tracking-widest uppercase`}
            >
              {isUser ? 'Athlete' : 'Bene Coach'}
            </p>
            <div className="bg-border h-1 w-1 rounded-full" />
            <p className={`${typography.muted} text-muted-foreground/40 text-[10px] font-bold`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div
            className={`relative rounded-3xl px-6 py-4 shadow-xl transition-all hover:shadow-2xl ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-[0_10px_30px_-10px_rgba(var(--primary),0.3)]'
                : 'bg-accent/40 border-border/50 text-foreground rounded-tl-none border backdrop-blur-md'
            } `}
          >
            <p
              className={`${typography.small} leading-relaxed font-medium ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}
            >
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

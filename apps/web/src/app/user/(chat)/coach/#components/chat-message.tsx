import { MessageData } from '@/deprecated/coach';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }: MessageData) {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-6 flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex max-w-[85%] gap-3 md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'} `}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-none'
                : 'dark:bg-accent border-muted text-foreground rounded-tl-none border bg-white'
            } `}
          >
            {message.content}
          </div>
          <span className="text-muted-foreground mt-1 px-1 text-[10px]">
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}

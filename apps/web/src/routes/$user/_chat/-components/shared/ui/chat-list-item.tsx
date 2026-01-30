import { MessageSquare } from 'lucide-react';
import { typography } from '@/lib/components';

interface ChatListItemProps {
  title: string;
  excerpt?: string;
  onClick?: () => void;
  className?: string;
}

export function ChatListItem({
  title,
  excerpt,
  onClick,
  className = '',
}: Readonly<ChatListItemProps>) {
  return (
    <button onClick={onClick} className={`group w-full text-left ${className}`}>
      <div className="bg-background/50 hover:bg-background hover:border-border/50 flex flex-col gap-1 rounded-xl border border-transparent p-3 transition-all duration-200 hover:shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <MessageSquare size={14} />
          </div>
          <span className={`${typography.small} truncate font-medium`}>{title}</span>
        </div>
        {excerpt && (
          <p className={`${typography.mutedXs} line-clamp-2 pl-10.5 opacity-70`}>
            {excerpt.length > 60 ? `${excerpt.substring(0, 60)}...` : excerpt}
          </p>
        )}
      </div>
    </button>
  );
}

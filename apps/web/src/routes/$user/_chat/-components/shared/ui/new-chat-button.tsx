import { Plus } from 'lucide-react';
import { typography } from '@/lib/components';

export const NewChatButton = ({ onNewChat }: { onNewChat: () => void }) => (
  <button
    onClick={onNewChat}
    className={`${typography.small} bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 shadow-md transition-all active:scale-95`}
  >
    <Plus size={16} />
    <span>New Chat</span>
  </button>
);

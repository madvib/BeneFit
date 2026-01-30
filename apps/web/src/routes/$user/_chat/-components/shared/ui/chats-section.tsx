import { typography } from '@/lib/components';
import { ChatData } from '../types';

export const ChatsSection = ({
  chats,
  ChatListItem,
}: {
  chats: ChatData[];
  ChatListItem: React.ComponentType<{ title: string; excerpt?: string }>;
}) => (
  <div className="border-border/50 border-b p-4">
    <h4 className={`${typography.muted} mb-3 text-[10px] font-black tracking-widest uppercase`}>
      Recent Chats
    </h4>
    <div className="space-y-2">
      {chats.map((item, idx) => (
        <ChatListItem key={idx} title={item.title} excerpt={item.excerpt} />
      ))}
    </div>
  </div>
);

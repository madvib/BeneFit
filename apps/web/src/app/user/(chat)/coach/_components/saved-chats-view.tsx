import { useState } from 'react';
import { MessageSquare, Plus, Settings } from 'lucide-react';
import CoachSettingsModal from './coach-settings-modal';
import { Button, ChatSidebar, typography } from '@/lib/components';

interface ChatData {
  id: number | string;
  title: string;
}
interface SavedChatsProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatData[];
  onNewChat: () => void;
}
export default function SavedChatsView({ isOpen, onClose, chats, onNewChat }: Readonly<SavedChatsProps>) {
    const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <ChatSidebar
        isOpen={isOpen}
        onClose={onClose}
        className="pt-24 md:pt-10" 
        header={
          <div className="p-4 w-full">
            <button
              onClick={onNewChat}
              className={`${typography.p} bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-2 rounded-lg px-4 py-3 shadow-sm transition-all`}
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>
        }
        footer={
           <Button
            onClick={() => setSettingsOpen(true)}
            variant="ghost"
            className={`${typography.small} text-foreground/80 hover:bg-muted flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors justify-start`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Button>
        }
      >
          {chats.map((item, idx) => (
            <div key={idx} className="mb-1">
                <button className="w-full text-left">
                  <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-border/40">
                    <MessageSquare className="text-muted-foreground opacity-70" size={18} />
                    <span className={`${typography.small} font-normal`}>{item.title}</span>
                  </div>
                </button>
            </div>
          ))}
      </ChatSidebar>
      <CoachSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

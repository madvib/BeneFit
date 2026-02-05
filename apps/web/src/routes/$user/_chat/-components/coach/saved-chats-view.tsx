import { useState } from 'react';
import { ChatSidebar } from '@/lib/components';
import { NewChatButton, FooterSettingsButton, ChatListItem, ChatData } from '../shared';
import CoachSettingsModal from './coach-settings-modal';

interface SavedChatsProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatData[];
  onNewChat: () => void;
}

export default function SavedChatsView({
  isOpen,
  onClose,
  chats,
  onNewChat,
}: Readonly<SavedChatsProps>) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <ChatSidebar
        isOpen={isOpen}
        onClose={onClose}
        className="pt-20 md:pt-4"
        header={<NewChatButton onNewChat={onNewChat} />}
        footer={<FooterSettingsButton onSettingsOpen={() => setSettingsOpen(true)} />}
      >
        <div className="space-y-2 px-2">
          {chats.map((item, idx) => (
            <ChatListItem key={idx} title={item.title} excerpt={item.excerpt} />
          ))}
        </div>
      </ChatSidebar>
      <CoachSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

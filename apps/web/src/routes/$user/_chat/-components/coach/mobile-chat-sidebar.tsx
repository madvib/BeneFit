import { useState } from 'react';
import {
  SidebarHeader,
  NewChatButton,
  ChatsSection,
  ChatListItem,
  AnalysisSection,
  SettingsFooter,
  MobileOverlay,
  RecommendationData,
  RecommendationItem,
  ChatData,
} from '../shared';
import CoachSettingsModal from './coach-settings-modal';

interface MobileChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatData[];
  recommendations: RecommendationData[];
  onNewChat: () => void;
  onGenerateSummary?: () => void;
  isGeneratingSummary?: boolean;
}

export default function MobileChatSidebar({
  isOpen,
  onClose,
  chats,
  recommendations,
  onNewChat,
  onGenerateSummary,
  isGeneratingSummary,
}: Readonly<MobileChatSidebarProps>) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <MobileOverlay isOpen={isOpen} onClose={onClose} />

      <aside
        className={`bg-background border-border fixed inset-y-0 left-0 z-50 flex h-full w-[320px] transform flex-col border-r transition-transform duration-300 ease-in-out sm:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarHeader title="Chat & Analysis" onClose={onClose} />
        <NewChatButton onNewChat={onNewChat} />

        <div className="no-scrollbar flex-1 overflow-y-auto">
          <ChatsSection chats={chats} ChatListItem={ChatListItem} />
          <AnalysisSection
            recommendations={recommendations}
            onGenerateSummary={onGenerateSummary}
            isGeneratingSummary={isGeneratingSummary}
            RecommendationItem={RecommendationItem}
          />
        </div>

        <SettingsFooter onSettingsOpen={() => setSettingsOpen(true)} />
      </aside>

      <CoachSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

'use client';

import { useCoachController } from '@/controllers';
import {
  ChatView,
  SavedChatsView,
  RightActionPanel,
} from '@/components/user/dashboard/coach';
import { useChatUI } from '@/controllers/hooks/use-chat-ui';
import { LoadingSpinner, ErrorPage } from '@/components';

export default function CoachPage() {
  const { leftOpen, rightOpen, toggleLeft, toggleRight } = useChatUI();

  const {
    savedChats,
    messages,
    isLoading,
    error,
    recommendations,
    sendMessage,
    handleNewChat,
  } = useCoachController();

  if (isLoading) {
    return <LoadingSpinner variant="screen" />;
  }

  if (error) {
    <ErrorPage
      title="Connections Loading Error"
      message="Unable to load your connected services."
      error={error}
      backHref="/"
    />;
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <SavedChatsView
        isOpen={leftOpen}
        onClose={toggleLeft}
        chats={savedChats}
        onNewChat={handleNewChat}
      />
      <ChatView messages={messages} onSendMessage={sendMessage} />
      <RightActionPanel
        isOpen={rightOpen}
        onClose={toggleRight}
        recommendations={recommendations}
      />
    </div>
  );
}

'use client';

import { useCoachController } from '@/controllers';
import { useChatUI } from '@/controllers/hooks/use-chat-ui';
import {
  ChatView,
  SavedChatsView,
  RightActionPanel,
} from '@/components/user/dashboard/coach';
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
    return (
      <ErrorPage
        title="Coach Error"
        message="Unable to load coach functionality."
        error={error}
        backHref="/"
      />
    );
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

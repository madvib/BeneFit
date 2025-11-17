'use client';

import TopTabNavigation from '@/components/user/dashboard/top-tab-navigation';
import { LoadingSpinner, PageContainer } from '@/components';
import { useCoachController, useIsMobile } from '@/controllers';
import {
  ChatView,
  SavedChatsView,
  RecommendationsView,
} from '@/components/user/dashboard/coach';

export default function CoachPage() {
  const {
    savedChats,
    messages,
    recommendations,
    isLoading,
    error,
    sendMessage,
    handleNewChat,
  } = useCoachController();

  const isMobile = useIsMobile(768);

  if (isLoading) {
    return (
      <PageContainer title="AI Coach" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="AI Coach" hideTitle={true}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </PageContainer>
    );
  }

  const chatView = () => (
    <ChatView messages={messages} onSendMessage={sendMessage} isLoading={false} />
  );

  const savedChatsView = () => (
    <SavedChatsView chats={savedChats} onNewChat={handleNewChat} />
  );

  const recommendationsView = () => (
    <RecommendationsView recommendations={recommendations} />
  );

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'saved-chats', label: 'Saved Chats' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  if (isMobile) {
    return (
      <PageContainer title="AI Coach" hideTitle={true}>
        <TopTabNavigation tabs={tabs} defaultActiveTab="chat">
          {{
            chat: chatView(),
            'saved-chats': savedChatsView(),
            recommendations: recommendationsView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  // Desktop view - keep existing layout
  return (
    <PageContainer title="AI Coach" hideTitle={true}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
        {/* Saved Chats Sidebar */}
        <div className="lg:col-span-1">{savedChatsView()}</div>

        {/* Chat Interface and Recommendations */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Chat Messages Area */}
          <div className="lg:col-span-2 flex flex-col">{chatView()}</div>

          {/* Recommendations Panel */}
          <div className="lg:col-span-1">{recommendationsView()}</div>
        </div>
      </div>
    </PageContainer>
  );
}

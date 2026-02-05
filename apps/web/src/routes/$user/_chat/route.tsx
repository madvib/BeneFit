import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ChatUIProvider } from '@/lib/hooks/use-chat-ui';
import { ChatHeader, PageContainer } from '@/lib/components';

export const Route = createFileRoute('/$user/_chat')({
  component: CoachChatLayout,
});

function CoachChatLayout() {
  return (
    <ChatUIProvider>
      <PageContainer variant="noPadding" className="flex h-screen flex-col overflow-hidden">
        <ChatHeader title={'AI Coach'} />
        <Outlet />
      </PageContainer>
    </ChatUIProvider>
  );
}

import { ChatUIProvider } from '@/lib/hooks/use-chat-ui';
import { PageContainer } from '@/lib/components';
import ChatHeader from './#components/chat-header';

interface CoachChatLayoutProperties {
  children: React.ReactNode;
}

export default function CoachChatLayout({ children }: CoachChatLayoutProperties) {
  return (
    <ChatUIProvider>
      <PageContainer className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
        <ChatHeader title={'AI Coach'} />
        {children}
      </PageContainer>
    </ChatUIProvider>
  );
}

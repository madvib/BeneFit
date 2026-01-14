import { ChatUIProvider } from '@/lib/hooks/use-chat-ui';
import { ChatHeader, PageContainer } from '@/lib/components';

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

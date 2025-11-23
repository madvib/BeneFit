import { PageContainer } from '@/components';
import { ChatHeader } from '@/components/user/dashboard/coach';
import { ChatUIProvider } from '@/controllers/hooks/use-chat-ui';

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

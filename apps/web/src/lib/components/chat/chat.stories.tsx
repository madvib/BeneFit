import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MessageSquare, Settings, Bot, AlertCircle } from 'lucide-react';
import { ChatList, ChatLayout, ChatSidebar, ChatInput, ChatMessage, ChatHeader } from './index';
import { Button, typography } from '@/lib/components';

const meta: Meta = {
  title: 'Components/Chat',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

// 1. Primitives Showcase
export const Primitives: StoryObj = {
  render: () => (
    <div className="p-8 space-y-12 max-w-4xl mx-auto bg-background min-h-screen">
       <div className="space-y-4">
          <h2 className={typography.h2}>Chat Primitives</h2>
          <p className={typography.muted}>Core building blocks for chat interfaces.</p>
       </div>

       {/* Messages */}
       <div className="space-y-6">
          <h3 className={typography.h3}>Messages</h3>
          <div className="grid gap-4 border p-6 rounded-xl bg-muted/20">
             <ChatMessage 
                id="1" 
                role="user" 
                content="This is a user message. It aligns to the right and uses the primary color." 
                timestamp={new Date()} 
                senderName="You"
             />
             <ChatMessage 
                id="2" 
                role="assistant" 
                content="This is an assistant message. It aligns to the left and uses a neutral background." 
                timestamp={new Date()} 
                senderName="Coach"
             />
              <ChatMessage 
                id="3" 
                role="system" 
                content="System message with custom icon." 
                timestamp={new Date()} 
                avatarIcon={Bot}
                senderName="System"
             />
              <ChatMessage 
                id="4" 
                role="assistant" 
                content="Error state example or high priority." 
                timestamp={new Date()} 
                avatarIcon={AlertCircle}
                senderName="Error"
                className="opacity-80" 
             />
          </div>
       </div>

       {/* Inputs */}
       <div className="space-y-6">
          <h3 className={typography.h3}>Inputs</h3>
          <div className="space-y-4 border p-6 rounded-xl bg-muted/20">
            <div>
               <p className={`${typography.labelSm} mb-2`}>Default State</p>
               <ChatInput onSend={() => {}} />
            </div>
             <div>
               <p className={`${typography.labelSm} mb-2`}>Disabled State</p>
               <ChatInput onSend={() => {}} disabled placeholder="Chat is currently disabled..." />
            </div>
          </div>
       </div>
    </div>
  ),
};

// 2. Full Interactive Layout
const ChatLayoutExample = () => {
    const [messages, setMessages] = useState([
        { id: '1', role: 'assistant', content: 'Welcome to the gym! How are you feeling today?', timestamp: new Date() },
    ]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleSend = (msg: string) => {
        setMessages([...messages, { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() }]);
        setTimeout(() => {
             setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'That sounds great. Let\'s get started with some warmups.', timestamp: new Date() }]);
        }, 800);
    };

    return (
        <div className="h-[600px] border rounded-xl overflow-hidden shadow-2xl flex flex-col bg-background">
            {/* Mock Header */}
            <div className="shrink-0 z-10">
               <ChatHeader title="AI Coach" />
            </div>

            <ChatLayout
                sidebar={
                    <ChatSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
                         header={<div className={`${typography.label} px-3 py-2`}>History</div>}
                         footer={
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Settings size={16} /> Settings
                            </Button>
                         }
                    >
                        <div className="space-y-1">
                            {['Leg Day Analysis', 'Nutrition Plan', 'Recovery Protocols'].map((t, i) => (
                                <button key={i} className={`flex w-full items-center gap-3 p-2 hover:bg-muted/50 rounded-lg text-left transition-colors ${typography.labelSm}`}>
                                    <MessageSquare size={14} className="text-muted-foreground" />
                                    {t}
                                </button>
                            ))}
                        </div>
                    </ChatSidebar>
                }
                rightPanel={
                   <div className="w-72 border-l p-4 hidden lg:block bg-background/50 backdrop-blur-sm">
                       <h3 className={`${typography.h4} mb-4`}>Context</h3>
                       <div className={`bg-accent/30 rounded-lg p-3 ${typography.small} space-y-2`}>
                          <p><strong>Goal:</strong> Hypertrophy</p>
                          <p><strong>Focus:</strong> Legs</p>
                       </div>
                   </div>
                }
            >
                <ChatList>
                    {messages.map((m) => (
                        <ChatMessage key={m.id} {...m} />
                    ))}
                </ChatList>
                <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
                    <ChatInput onSend={handleSend} />
                </div>
            </ChatLayout>
        </div>
    );
};

export const FullLayout: StoryObj = {
    render: () => (
        <div className="p-4 md:p-8 bg-dot-pattern min-h-screen flex items-center justify-center bg-muted/10">
            <div className="w-full max-w-6xl">
                 <ChatLayoutExample />
            </div>
        </div>
    )
}

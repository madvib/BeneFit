import type { Meta, StoryObj } from '@storybook/react';
import UnifiedHeader from './unified-header';
import { ThemeProvider } from '../theme/theme-provider';
import ChatHeader from '@/app/user/(chat)/_components/chat-header';

// Mocking useSession and useUI is tricky without a proper context mock.
// For now, we will assume standard render.
// Ideally, we'd have a Storybook decorator that wraps this in the Auth/UI contexts.

const meta: Meta = {
  title: 'Components/Features/Header',
  component: UnifiedHeader,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="bg-background min-h-[200px]">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Marketing: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="marketing" />,
};

export const Application: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="application" />,
};

export const AuthVariant: StoryObj<typeof UnifiedHeader> = {
  render: () => <UnifiedHeader variant="auth" />,
};

// --- Application Specific Headers ---

export const ChatHeaderStory: StoryObj = {
  name: 'Chat Header',
  render: () => (
    <div className="border-b">
      <ChatHeader title="AI Coach" />
    </div>
  ),
};

export const HeaderGallery: StoryObj = {
  name: 'All Headers Gallery',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="bg-muted/10 space-y-12 p-8">
      <div className="space-y-4">
        <div className="container px-4">
          <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Marketing / Unified Header
          </h3>
          <p className="text-muted-foreground text-xs">Public facing header</p>
        </div>
        <div className="bg-background border">
          <UnifiedHeader variant="marketing" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="container px-4">
          <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Chat Header
          </h3>
          <p className="text-muted-foreground text-xs">Used in Coach & Chat views</p>
        </div>
        <div className="bg-background border-y">
          <ChatHeader title="AI Coach" />
        </div>
      </div>
    </div>
  ),
};

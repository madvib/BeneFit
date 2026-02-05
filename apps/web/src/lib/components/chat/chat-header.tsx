import { Menu, Star, Share2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { UserAccountMenu } from '@/lib/components';
import { useChatUI } from '@/lib/hooks/use-chat-ui';
import {
  HeaderRoot,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  BeneLogo,
  DashboardNavigation,
  Button,
  Dropdown,
} from '@/lib/components';
import { ChatTitle } from './chat-title';

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: Readonly<ChatHeaderProps>) {
  const { rightOpen, toggleRight, toggleMobileSidebar } = useChatUI();

  return (
    <HeaderRoot>
      {/* LEFT: Mobile Menu + Logo + Title */}
      <HeaderLeft>
        {/* Mobile hamburger - only on small screens */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileSidebar}
          className="hover:bg-muted text-muted-foreground hover:text-foreground mr-5 -ml-2 md:hidden"
        >
          <Menu size={20} />
        </Button>
        {/* Desktop hamburger - only on medium+ screens */}

        <BeneLogo hideLabelOnMobile />
        <ChatTitle title={title} version="v2.1" />
      </HeaderLeft>

      {/* CENTER: Model Selector */}
      <HeaderCenter>
        <DashboardNavigation />
      </HeaderCenter>

      {/* RIGHT: Tools + Profile + Sidebar Toggle */}
      <HeaderRight>
        <div className="mr-1 flex items-center gap-1">
          {/* TODO(UI) use Button components */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hidden hover:bg-yellow-500/10 hover:text-yellow-500 sm:flex"
          >
            <Star size={18} />
          </Button>

          {/* Dropdown for Share */}
          <Dropdown.Root>
            <Dropdown.Trigger className="text-muted-foreground hover:text-primary hover:bg-primary/10 hidden items-center justify-center rounded-md p-2 transition-colors sm:flex">
              <Share2 size={18} />
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item>Copy Link</Dropdown.Item>
              <Dropdown.Item>Export Transcript</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>

        <UserAccountMenu isLoggedIn={true} />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRight}
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-1 hidden items-center justify-center md:flex"
        >
          {rightOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </Button>
      </HeaderRight>
    </HeaderRoot>
  );
}
// <Button
//   variant="ghost"
//   size="sm"
//   onClick={onClose}
//   className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg transition-all active:scale-90 lg:hidden"
// >
//   <PanelRightClose size={16} />
// </Button>

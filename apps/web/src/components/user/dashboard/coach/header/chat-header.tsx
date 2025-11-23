'use client';
import { Menu, Star, Share2, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ChatTitle } from './chat-title';
import HeaderRoot from '../../../../common/header/primitives/header-root';
import { BeneLogo } from '../../../../common/ui-primitives/logo/logo';
import {
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
} from '../../../../common/header/primitives/sections';
import UserAccountMenu from '@/components/common/header/navigation/account-dropdown/account-dropdown';
import { useChatUI } from '@/controllers/hooks/use-chat-ui';

interface ChatHeaderProps {
  title: string;
}

export default function ChatHeader({ title }: ChatHeaderProps) {
  const { toggleLeft: toggleLeft, toggleRight, rightOpen } = useChatUI();

  return (
    <HeaderRoot>
      {/* LEFT: Mobile Menu + Logo + Title */}
      <HeaderLeft>
        <button
          onClick={toggleLeft}
          className="hover:bg-muted text-muted-foreground hover:text-foreground mr-10 -ml-2 rounded-md p-2 md:hidden"
        >
          <Menu size={20} />
        </button>
        <BeneLogo hideLabelOnMobile />
        <ChatTitle title={title} version="v2.1" />
      </HeaderLeft>

      {/* CENTER: Model Selector */}
      <HeaderCenter>Chat Title</HeaderCenter>

      {/* RIGHT: Tools + Profile + Sidebar Toggle */}
      <HeaderRight>
        <div className="mr-1 flex items-center gap-1">
          <button className="text-muted-foreground hidden rounded-md p-2 transition-colors hover:bg-yellow-500/10 hover:text-yellow-500 sm:block">
            <Star size={18} />
          </button>
          <button className="text-muted-foreground hover:text-primary hover:bg-primary/10 hidden rounded-md p-2 transition-colors sm:block">
            <Share2 size={18} />
          </button>
        </div>

        <UserAccountMenu isLoggedIn={true} />

        <button
          onClick={toggleRight}
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-1 hidden rounded-full p-2 transition-colors md:block"
        >
          {rightOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </button>
      </HeaderRight>
    </HeaderRoot>
  );
}

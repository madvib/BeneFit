import { MessageSquare, Plus, Settings } from 'lucide-react';

interface ChatData {
  id: number | string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}
interface SavedChatsProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatData[];
  onNewChat: () => void;
}
export default function SavedChatsView({
  isOpen,
  onClose,
  chats,
  onNewChat,
}: SavedChatsProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside
        className={`bg-accent/30 border-muted fixed inset-y-0 left-0 z-40 flex h-full w-[280px] transform flex-col border-r pt-16 transition-transform duration-300 ease-in-out md:static md:transform-none md:pt-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[280px] md:w-[280px] xl:ml-0 xl:w-[280px]'} ${!isOpen && 'md:hidden xl:flex'} `}
      >
        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center gap-2 rounded-lg px-4 py-3 font-medium shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Scrollable List */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
          {chats.map((item, idx) => (
            <div key={idx} className="mb-6">
              {/* <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase">
                {item.category}
              </h3> */}
              <div className="space-y-1">
                <button
                  key={idx}
                  className="text-foreground/80 hover:bg-muted hover:text-foreground group flex w-full items-center gap-2 truncate rounded-md px-3 py-2 text-left text-sm transition-colors"
                >
                  <MessageSquare
                    size={14}
                    className="text-muted-foreground group-hover:text-primary"
                  />
                  <span className="truncate">{item.title}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* User Settings Footer */}
        <div className="border-muted mt-auto border-t p-4">
          <button className="text-foreground/80 hover:bg-muted flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}

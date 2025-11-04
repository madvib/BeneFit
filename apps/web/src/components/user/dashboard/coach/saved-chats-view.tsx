interface ChatData {
  id: number | string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface SavedChatsViewProps {
  chats: ChatData[];
  onNewChat: () => void;
}

export default function SavedChatsView({ chats, onNewChat }: SavedChatsViewProps) {
  return (
    <div className="bg-secondary p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-xl font-bold mb-4">Saved Chats</h3>

      <div className="space-y-3 overflow-y-auto flex-grow">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
              chat.unread ? 'bg-primary/10 border-l-4 border-primary' : 'bg-background'
            }`}
          >
            <div className="flex justify-between">
              <h4 className="font-medium truncate">{chat.title}</h4>
              {chat.unread && (
                <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {chat.lastMessage}
            </p>
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {chat.timestamp}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-4 btn btn-primary" onClick={onNewChat}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        New Chat
      </button>
    </div>
  );
}

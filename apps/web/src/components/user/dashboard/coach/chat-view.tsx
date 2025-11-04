import { useState, FormEvent } from 'react';

interface MessageData {
  id: number | string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

interface ChatViewProps {
  messages: MessageData[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export default function ChatView({
  messages,
  onSendMessage,
  isLoading = false,
}: ChatViewProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.trim() === '') return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-secondary p-6 rounded-lg shadow-md flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">AI Fitness Coach</h3>
          <span className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">Online</span>
          </span>
        </div>

        <div className="overflow-y-auto flex-grow mb-4 space-y-4 p-4 bg-background rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-3 rounded-lg border border-muted bg-background"
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

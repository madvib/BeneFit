'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecommendationCard from '@/components/common/RecommendationCard';
import { useState } from 'react';

interface Chat {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'coach';
  timestamp: string;
}

export default function CoachPage() {
  // Mock data for saved chats
  const savedChats: Chat[] = [
    { id: 1, title: 'Post-Workout Recovery', lastMessage: 'Try light stretching and 8oz of water', timestamp: '10:24 AM', unread: false },
    { id: 2, title: 'Nutrition Plan', lastMessage: 'Increase protein for muscle recovery', timestamp: 'Yesterday', unread: true },
    { id: 3, title: 'Running Technique', lastMessage: 'Focus on cadence: aim for 170-180 steps/min', timestamp: 'May 8', unread: false },
    { id: 4, title: 'Goal Progress', lastMessage: 'You\'re ahead of your plan! Keep going!', timestamp: 'May 5', unread: false },
    { id: 5, title: 'Sleep Optimization', lastMessage: 'Aim for 7-9 hours for better recovery', timestamp: 'May 3', unread: false },
  ];

  const initialMessages: Message[] = [
    { id: 1, content: 'Hi! How can I help you with your fitness journey today?', sender: 'coach', timestamp: '10:15 AM' },
    { id: 2, content: 'I\'m having trouble with my running form. Any tips?', sender: 'user', timestamp: '10:16 AM' },
    { id: 3, content: 'Certainly! Focus on keeping your shoulders relaxed, landing mid-foot, and maintaining a steady cadence around 170-180 steps per minute.', sender: 'coach', timestamp: '10:17 AM' },
    { id: 4, content: 'That sounds helpful. Should I be concerned about my pace?', sender: 'user', timestamp: '10:18 AM' },
    { id: 5, content: 'Pace is important, but form comes first. Once your technique is solid, you can work on speed. Consistency in your training is key!', sender: 'coach', timestamp: '10:19 AM' },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const recommendations = [
    {
      id: 1,
      title: 'Try HIIT Training',
      description: 'Based on your running progress, incorporating HIIT sessions could help improve your endurance.',
      category: 'Workout'
    },
    {
      id: 2,
      title: 'Hydration Check',
      description: 'Your recent activities show you might need to increase water intake during long runs.',
      category: 'Nutrition'
    },
    {
      id: 3,
      title: 'Sleep Optimization',
      description: 'To support your recovery, aim for 7-9 hours of sleep, especially on days with intense training.',
      category: 'Wellness'
    }
  ];

  const [inputValue, setInputValue] = useState('');

  // Function to handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: "I understand. Based on your activity data and goals, I recommend focusing on proper form first before increasing intensity. Would you like specific exercises?",
        sender: 'coach',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">AI Coach</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* Saved Chats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-secondary p-6 rounded-lg shadow-md h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4">Saved Chats</h3>
              
              <div className="space-y-3 overflow-y-auto flex-grow">
                {savedChats.map((chat) => (
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
                    <p className="text-sm text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-2 text-right">{chat.timestamp}</p>
                  </div>
                ))}
              </div>
              
              <button className="mt-4 btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Chat
              </button>
            </div>
          </div>
          
          {/* Chat Interface and Recommendations */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Chat Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="bg-secondary p-6 rounded-lg shadow-md flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">AI Fitness Coach</h3>
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Online</span>
                  </span>
                </div>
                
                <div className="overflow-y-auto flex-grow mb-4 space-y-4 p-4 bg-background rounded-lg h-[50vh]">
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
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="mt-auto">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..." 
                      className="flex-grow p-3 rounded-lg border border-muted bg-background"
                    />
                    <button type="submit" className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Recommendations Panel */}
            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 rounded-lg shadow-md h-full">
                <h3 className="text-xl font-bold mb-4">Personal Recommendations</h3>
                
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      id={rec.id}
                      title={rec.title}
                      description={rec.description}
                      category={rec.category}
                      onLearnMore={() => console.log(`Learning more about ${rec.title}`)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
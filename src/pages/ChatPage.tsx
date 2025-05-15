
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChatInterface from '@/components/chat/ChatInterface';
import GamesList from '@/components/games/GamesList';
import AuthForm from '@/components/auth/AuthForm';

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'games'>('chat');
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Access Health Chat</h1>
        <AuthForm />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Health Assistant</h1>
          <p className="text-muted-foreground">
            Chat about your health concerns and get personalized recommendations
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-1 bg-muted rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'chat'
                ? 'bg-white text-health-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'games'
                ? 'bg-white text-health-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Games
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className={`${activeTab === 'chat' ? 'md:col-span-2' : 'md:col-span-3'}`}>
          {activeTab === 'chat' ? (
            <ChatInterface />
          ) : (
            <GamesList />
          )}
        </div>
        
        {activeTab === 'chat' && (
          <div className="md:col-span-1">
            <GamesList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

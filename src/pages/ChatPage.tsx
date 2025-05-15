
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
    <div className="container mx-auto px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold tracking-tight">Health Assistant</h1>
          <p className="text-muted-foreground">
            Chat about your health concerns and get personalized recommendations
          </p>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 self-start md:self-auto">
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

      {/* Responsive layout with better spacing */}
      {activeTab === 'chat' ? (
        <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <ChatInterface />
          </div>
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <GamesList compact={true} />
            </div>
          </div>
        </div>
      ) : (
        <GamesList />
      )}
    </div>
  );
};

export default ChatPage;

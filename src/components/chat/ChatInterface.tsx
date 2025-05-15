import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Trash2, User } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, clearChat, isBotTyping } = useChat();
  const { suggestedGames } = useGameTracker();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    } else {
      toast("Please type a message first");
    }
  };

  const handleClearChat = () => {
    clearChat();
    toast("Chat cleared successfully");
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Health Assistant</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClearChat}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={18} />
            <span className="sr-only">Clear chat</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[500px] p-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <User size={48} className="mb-4 text-health-primary/50" />
              <p className="text-center max-w-xs">
                Hi there! I'm your health assistant. Tell me about any health concerns or symptoms you're experiencing.
              </p>
            </div>
          ) : (
            <div>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message ${msg.sender === 'user' ? 'user' : 'bot'}`}
                >
                  {msg.content}

                  {msg.sender === 'bot' && msg.suggestedGames && msg.suggestedGames.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      <p className="text-sm font-medium">Suggested games that might help:</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestedGames.map((game) => (
                          <span 
                            key={game} 
                            className="text-xs bg-health-accent/30 text-health-dark px-2 py-1 rounded-full"
                          >
                            {game}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isBotTyping && (
                <div className="chat-message bot">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-health-primary rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-health-primary rounded-full animate-pulse delay-150"></div>
                    <div className="h-2 w-2 bg-health-primary rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSendMessage} className="w-full flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit" className="bg-health-primary hover:bg-health-secondary">
            <Send size={18} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;

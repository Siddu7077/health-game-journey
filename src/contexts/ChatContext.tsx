
import { createContext, useContext, useState } from 'react';
import { useGameTracker } from './GameTrackerContext';

interface Message {
  sender: 'user' | 'bot';
  content: string;
  timestamp: number;
  suggestedGames?: string[];
}

interface ChatContextType {
  messages: Message[];
  isBotTyping: boolean;
  sendMessage: (message: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock database of health concerns and responses
const healthResponses = {
  anxiety: {
    response: "I understand you're dealing with anxiety. This is a common condition characterized by persistent and excessive worry about various things. Some initial steps you can take include: practicing deep breathing exercises, trying mindfulness meditation, regular physical activity, and ensuring you get adequate sleep. Our interactive games may also help as therapeutic tools.",
    games: ['breathing', 'memory']
  },
  depression: {
    response: "I'm sorry to hear you're experiencing depression. Depression is a mood disorder that affects how you feel, think, and handle daily activities. Some steps that might help include: establishing a routine, setting small goals, engaging in physical activity, and connecting with others. Our games can also provide a helpful distraction and cognitive stimulation.",
    games: ['memory', 'reaction']
  },
  stress: {
    response: "Sounds like you're dealing with significant stress. Stress is your body's response to pressure and can affect your mental and physical health. Some helpful strategies include: identifying stress triggers, practicing relaxation techniques like deep breathing, regular exercise, and maintaining a healthy lifestyle. Our breathing exercise game was specifically designed to help with stress reduction.",
    games: ['breathing', 'reaction']
  },
  insomnia: {
    response: "Difficulty sleeping can be very frustrating. Insomnia can be caused by stress, anxiety, poor sleep habits, or other factors. Some strategies that may help include: maintaining a consistent sleep schedule, creating a restful environment, limiting screen time before bed, and practicing relaxation techniques. Our breathing exercise might help you unwind before bedtime.",
    games: ['breathing']
  },
  headache: {
    response: "I'm sorry you're experiencing headaches. Headaches can have various causes including tension, dehydration, eye strain, or underlying health conditions. Some steps that might help include: staying hydrated, taking breaks from screens, practicing relaxation techniques, and ensuring adequate sleep. Our breathing exercise might help reduce tension that contributes to headaches.",
    games: ['breathing']
  }
};

// Generic response for unrecognized conditions
const genericResponse = {
  response: "Thank you for sharing your health concern. While I can provide general information, please remember I'm not a replacement for professional medical advice. It's important to consult with a healthcare provider about your symptoms. In the meantime, maintaining a healthy lifestyle with regular exercise, balanced diet, adequate sleep, and stress management can be beneficial for overall health.",
  games: ['breathing', 'memory', 'reaction']
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      content: "Hello! I'm your health assistant. Please tell me about any health concerns or symptoms you're experiencing, and I'll try to provide some helpful information and game recommendations.",
      timestamp: Date.now()
    }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const { suggestGames } = useGameTracker();

  const sendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      sender: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);
    
    // Process the message to generate a response
    setTimeout(() => {
      const response = generateResponse(content);
      
      const botMessage: Message = {
        sender: 'bot',
        content: response.message,
        timestamp: Date.now(),
        suggestedGames: response.games
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
      
      // Update suggested games in the game tracker
      if (response.games && response.games.length > 0) {
        suggestGames(response.games);
      }
    }, 1500); // Simulate thinking time
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        content: "Hello! I'm your health assistant. Please tell me about any health concerns or symptoms you're experiencing, and I'll try to provide some helpful information and game recommendations.",
        timestamp: Date.now()
      }
    ]);
  };

  const generateResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for health conditions in the user's message
    for (const [condition, data] of Object.entries(healthResponses)) {
      if (lowerCaseMessage.includes(condition)) {
        return {
          message: data.response,
          games: data.games
        };
      }
    }
    
    // If no specific condition matched, provide a generic response
    return {
      message: genericResponse.response,
      games: genericResponse.games
    };
  };

  return (
    <ChatContext.Provider value={{ messages, isBotTyping, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

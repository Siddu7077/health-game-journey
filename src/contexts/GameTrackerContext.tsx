
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface GameStats {
  [key: string]: any;
}

interface GameSession {
  gameId: string;
  startTime: number;
  endTime: number | null;
  duration: number | null;
  completed: boolean;
  stats: GameStats;
}

interface GameTrackerContextType {
  currentSession: GameSession | null;
  sessions: GameSession[];
  suggestedGames: string[];
  startGameSession: (gameId: string) => void;
  endGameSession: (gameId: string, stats: GameStats) => void;
  suggestGames: (gameIds: string[]) => void;
}

const GameTrackerContext = createContext<GameTrackerContextType | undefined>(undefined);

export const GameTrackerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [suggestedGames, setSuggestedGames] = useState<string[]>([]);
  const { user } = useAuth();

  // Load saved sessions from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedSessions = localStorage.getItem(`healthgames_sessions_${user.id}`);
      if (savedSessions) {
        try {
          setSessions(JSON.parse(savedSessions));
        } catch (error) {
          console.error('Failed to parse saved sessions:', error);
        }
      }
    } else {
      setSessions([]);
    }
  }, [user]);

  // Save sessions to localStorage when they change
  useEffect(() => {
    if (user && sessions.length > 0) {
      localStorage.setItem(`healthgames_sessions_${user.id}`, JSON.stringify(sessions));
    }
  }, [sessions, user]);

  // Register beforeunload event to track when user closes the tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession) {
        endGameSession(currentSession.gameId, { completed: false, closed_tab: true });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSession]);

  const startGameSession = (gameId: string) => {
    // End current session if one exists
    if (currentSession) {
      endGameSession(currentSession.gameId, { completed: false });
    }
    
    const newSession: GameSession = {
      gameId,
      startTime: Date.now(),
      endTime: null,
      duration: null,
      completed: false,
      stats: {}
    };
    
    setCurrentSession(newSession);
  };

  const endGameSession = (gameId: string, stats: GameStats) => {
    if (currentSession && currentSession.gameId === gameId) {
      const endTime = Date.now();
      const duration = endTime - currentSession.startTime;
      
      const completedSession: GameSession = {
        ...currentSession,
        endTime,
        duration,
        completed: stats.completed !== undefined ? stats.completed : true,
        stats
      };
      
      setSessions((prev) => [...prev, completedSession]);
      setCurrentSession(null);
      
      console.log('Game session ended:', completedSession);
    } else {
      console.warn('Trying to end a game session that is not current or does not match');
    }
  };

  const suggestGames = (gameIds: string[]) => {
    setSuggestedGames(gameIds);
  };

  return (
    <GameTrackerContext.Provider 
      value={{ 
        currentSession, 
        sessions, 
        suggestedGames,
        startGameSession, 
        endGameSession,
        suggestGames 
      }}
    >
      {children}
    </GameTrackerContext.Provider>
  );
};

export const useGameTracker = () => {
  const context = useContext(GameTrackerContext);
  if (context === undefined) {
    throw new Error('useGameTracker must be used within a GameTrackerProvider');
  }
  return context;
};

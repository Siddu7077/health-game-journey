
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AnalyticsContextType {
  stats: any;
  isLoading: boolean;
  refreshStats: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  // Load or generate stats when admin user logs in
  useEffect(() => {
    if (user && isAdmin) {
      refreshStats();
    }
  }, [user, isAdmin]);

  const refreshStats = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be an API call to fetch analytics data
      // For demo purposes, we'll just use mock data
      setStats({
        users: {
          total: 128,
          active: 85,
          new: 22
        },
        sessions: {
          total: 512,
          avgDuration: 9.4
        },
        games: {
          memory: { plays: 180, avgDuration: 8.2, avgRating: 4.2 },
          breathing: { plays: 205, avgDuration: 10.5, avgRating: 4.5 },
          reaction: { plays: 127, avgDuration: 5.6, avgRating: 3.9 }
        },
        diseases: {
          anxiety: 45,
          depression: 30,
          insomnia: 15,
          stress: 25,
          other: 10
        }
      });
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AnalyticsContext.Provider value={{ stats, isLoading, refreshStats }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

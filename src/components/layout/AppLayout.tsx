
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const AppLayout = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Show welcome toast when user first arrives
  useEffect(() => {
    if (location.pathname === '/' && !sessionStorage.getItem('welcomed')) {
      setTimeout(() => {
        toast("Welcome to HealthGames - Chat with our AI assistant about your health concerns and discover therapeutic games.");
        sessionStorage.setItem('welcomed', 'true');
      }, 1000);
    }
  }, [location.pathname, toast]);

  // Track page views (for analytics)
  useEffect(() => {
    // In a real app, this would log page views to an analytics service
    console.log(`Page viewed: ${location.pathname}`);
  }, [location.pathname]);

  // Before unload listener for exit survey
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show the confirmation if user has spent some time on the site
      const timeSpent = sessionStorage.getItem('site-enter-time');
      if (timeSpent && Date.now() - parseInt(timeSpent) > 60000) { // 1 minute
        // In a real implementation, we would use the Beacon API to send analytics
        // navigator.sendBeacon('/api/exit-analytics', JSON.stringify({ timeSpent: Date.now() - parseInt(timeSpent) }));
      }
    };

    if (!sessionStorage.getItem('site-enter-time')) {
      sessionStorage.setItem('site-enter-time', Date.now().toString());
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
};

export default AppLayout;

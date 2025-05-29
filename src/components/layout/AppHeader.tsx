
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogIn, Menu, X, Settings, BarChart2 } from 'lucide-react';

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-health-primary rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl text-health-dark">HappiMate</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-health-primary px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/games" className="text-gray-600 hover:text-health-primary px-3 py-2 rounded-md">
              Games
            </Link>
            <Link to="/chat" className="text-gray-600 hover:text-health-primary px-3 py-2 rounded-md">
              Chat Assistant
            </Link>
            <Link to="/stats" className="text-gray-600 hover:text-health-primary px-3 py-2 rounded-md">
              My Stats
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-health-primary px-3 py-2 rounded-md">
                Admin Dashboard
              </Link>
            )}
          </nav>
          
          <div className="hidden md:flex items-center">
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 text-sm hover:bg-gray-100 px-3 py-2 rounded-md">
                <div className="bg-health-primary/20 rounded-full p-1">
                  <User size={18} className="text-health-primary" />
                </div>
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-health-primary hover:bg-health-secondary text-white flex items-center gap-2">
                  <LogIn size={18} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link to="/games" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Games
            </Link>
            <Link to="/chat" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat Assistant
            </Link>
            <Link to="/stats" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span>My Statistics</span>
                <BarChart2 size={18} />
              </div>
            </Link>
            {isAdmin && (
              <Link to="/admin" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <Link to="/profile" 
                className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Profile ({user.name})</span>
                <Settings size={18} />
              </Link>
            ) : (
              <Link to="/auth" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-health-primary text-white text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;

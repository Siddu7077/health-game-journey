
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Profile</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={18} />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center space-x-4">
          <div className="bg-health-primary/20 rounded-full p-3">
            <User className="h-6 w-6 text-health-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium text-base">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Age:</span>
            <span>{user.age}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gender:</span>
            <span className="capitalize">{user.gender}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
              Logging out...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogOut size={16} />
              Sign Out
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;

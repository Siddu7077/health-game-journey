import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import UserProfile from '@/components/auth/UserProfile';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameStat {
  totalSessions: number;
  totalTime: number;
  bestScore: number | null;
  lastPlayed: number | null;
}

interface GameStats {
  [gameId: string]: GameStat;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { sessions } = useGameTracker();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/auth');
    return null;
  }

  const gameStats: GameStats = sessions.reduce((acc, session) => {
    const gameId = session.gameId;
    
    if (!acc[gameId]) {
      acc[gameId] = {
        totalSessions: 0,
        totalTime: 0,
        bestScore: null,
        lastPlayed: null
      };
    }
    
    acc[gameId].totalSessions += 1;
    
    if (session.duration) {
      acc[gameId].totalTime += session.duration;
    }
    
    if (session.stats) {
      // For memory game, lower moves is better
      if (gameId === 'memory' && session.stats.moves) {
        if (acc[gameId].bestScore === null || session.stats.moves < acc[gameId].bestScore) {
          acc[gameId].bestScore = session.stats.moves;
        }
      }
      
      // For reaction game, lower time is better
      if (gameId === 'reaction' && session.stats.bestTime) {
        if (acc[gameId].bestScore === null || session.stats.bestTime < acc[gameId].bestScore) {
          acc[gameId].bestScore = session.stats.bestTime;
        }
      }
    }
    
    // Keep track of most recent session
    if (!acc[gameId].lastPlayed || session.startTime > acc[gameId].lastPlayed) {
      acc[gameId].lastPlayed = session.startTime;
    }
    
    return acc;
  }, {} as GameStats);

  const gameNames = {
    memory: 'Memory Match',
    breathing: 'Breathing Exercise',
    reaction: 'Reaction Time'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Your Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserProfile />
          
          <div className="mt-4 flex flex-col gap-4">
            <Button variant="outline" asChild>
              <Link to="/chat" className="w-full">Chat with Health Assistant</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/games" className="w-full">Play Therapeutic Games</Link>
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(gameStats).length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Game Statistics</h3>
                    <div className="space-y-4">
                      {Object.entries(gameStats).map(([gameId, stats]) => (
                        <div key={gameId} className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium text-health-dark">
                            {gameNames[gameId as keyof typeof gameNames] || gameId}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Sessions</p>
                              <p className="font-medium">{stats.totalSessions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Total Time</p>
                              <p className="font-medium">
                                {Math.round(stats.totalTime / 1000 / 60)} min
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Best Score</p>
                              <p className="font-medium">
                                {stats.bestScore !== null ? (
                                  gameId === 'reaction' ? 
                                    `${stats.bestScore} ms` : 
                                    `${stats.bestScore} moves`
                                ) : '-'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last Played</p>
                              <p className="font-medium">
                                {stats.lastPlayed ? new Date(stats.lastPlayed).toLocaleDateString() : '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {sessions.slice(-5).reverse().map((session, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded-md">
                          <span>
                            Played {gameNames[session.gameId as keyof typeof gameNames] || session.gameId}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(session.startTime).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You haven't played any games yet</p>
                  <Button asChild>
                    <Link to="/games">Try Our Games</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

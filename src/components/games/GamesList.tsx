
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { useToast } from '@/components/ui/sonner';
import { Play, Timer, Award } from 'lucide-react';
import MemoryGame from './MemoryGame';
import BreathingExercise from './BreathingExercise';
import ReactionGame from './ReactionGame';

const games = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Exercise your memory by matching pairs of cards',
    icon: <Award className="h-8 w-8 text-health-primary" />,
    component: MemoryGame,
    benefits: ['Improves cognitive function', 'Enhances memory', 'Helps with focus and concentration']
  },
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    description: 'Guided breathing exercise for stress and anxiety relief',
    icon: <Timer className="h-8 w-8 text-health-primary" />,
    component: BreathingExercise,
    benefits: ['Reduces stress and anxiety', 'Improves lung function', 'Helps with mindfulness']
  },
  {
    id: 'reaction',
    name: 'Reaction Time',
    description: 'Test and improve your reaction time',
    icon: <Play className="h-8 w-8 text-health-primary" />,
    component: ReactionGame,
    benefits: ['Improves cognitive processing speed', 'Enhances hand-eye coordination', 'Fun way to stay mentally sharp']
  }
];

const GamesList = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { startGameSession, suggestedGames } = useGameTracker();
  const { toast } = useToast();

  const handleStartGame = (gameId: string) => {
    startGameSession(gameId);
    setActiveGame(gameId);
    toast({
      title: `Starting ${games.find(g => g.id === gameId)?.name}`,
      description: "Your time will be tracked for research purposes.",
    });
  };

  const handleExitGame = () => {
    setActiveGame(null);
  };

  // If a game is active, render that game's component
  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    if (game) {
      const GameComponent = game.component;
      return <GameComponent onExit={handleExitGame} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Therapeutic Games</h2>
        <p className="text-muted-foreground">
          Games specifically designed to help with various health concerns.
        </p>
      </div>

      {suggestedGames.length > 0 && (
        <Card className="bg-health-light border-health-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-health-dark">Recommended for You</CardTitle>
            <CardDescription>
              Based on your conversation with our health assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestedGames.map((gameId) => {
                const game = games.find(g => g.id === gameId);
                if (game) {
                  return (
                    <span 
                      key={gameId}
                      className="inline-flex items-center gap-1 cursor-pointer bg-health-primary/20 text-health-dark px-3 py-1 rounded-full hover:bg-health-primary/30"
                      onClick={() => handleStartGame(gameId)}
                    >
                      <Play size={14} />
                      {game.name}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid md:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="game-card hover:border-health-primary animate-fade-in">
            <CardHeader className="pb-2">
              <div className="mb-2">{game.icon}</div>
              <CardTitle>{game.name}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Benefits:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {game.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleStartGame(game.id)}
                className="mt-4 w-full py-2 bg-health-primary text-white rounded-md hover:bg-health-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Play size={18} />
                Play Now
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesList;

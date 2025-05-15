
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { useToast } from '@/components/ui/sonner';
import { Play, Award, Brain, Heart, Puzzle, Music, Gamepad, BookOpen, Activity, Dumbbell, Headphones, Bell } from 'lucide-react';
import MemoryGame from './MemoryGame';
import BreathingExercise from './BreathingExercise';
import ReactionGame from './ReactionGame';
import WordScrambleGame from './WordScrambleGame';
import ColorRelaxationGame from './ColorRelaxationGame';
import PatternMatchGame from './PatternMatchGame';
import FocusCounterGame from './FocusCounterGame';
import MathChallengeGame from './MathChallengeGame';
import MusicTherapyGame from './MusicTherapyGame';

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
    id: 'reaction',
    name: 'Reaction Time',
    description: 'Test and improve your reaction time',
    icon: <Activity className="h-8 w-8 text-health-primary" />,
    component: ReactionGame,
    benefits: ['Improves cognitive processing speed', 'Enhances hand-eye coordination', 'Fun way to stay mentally sharp']
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble words to boost vocabulary and cognitive skills',
    icon: <BookOpen className="h-8 w-8 text-health-primary" />,
    component: WordScrambleGame,
    benefits: ['Expands vocabulary', 'Improves cognitive flexibility', 'Enhances problem-solving skills']
  },
  {
    id: 'color-relaxation',
    name: 'Color Therapy',
    description: 'Interactive color-based relaxation exercise',
    icon: <Heart className="h-8 w-8 text-health-primary" />,
    component: ColorRelaxationGame,
    benefits: ['Reduces stress and anxiety', 'Improves mood', 'Enhances focus and mindfulness']
  },
  {
    id: 'pattern-match',
    name: 'Pattern Matching',
    description: 'Find and match visual patterns quickly',
    icon: <Puzzle className="h-8 w-8 text-health-primary" />,
    component: PatternMatchGame,
    benefits: ['Improves visual processing', 'Enhances pattern recognition', 'Boosts cognitive speed']
  },
  {
    id: 'focus-counter',
    name: 'Focus Counter',
    description: 'Count specific objects while ignoring distractions',
    icon: <Brain className="h-8 w-8 text-health-primary" />,
    component: FocusCounterGame,
    benefits: ['Improves selective attention', 'Enhances concentration', 'Trains visual discrimination']
  },
  {
    id: 'math-challenge',
    name: 'Mental Math',
    description: 'Quick arithmetic challenges to boost brain power',
    icon: <Dumbbell className="h-8 w-8 text-health-primary" />,
    component: MathChallengeGame,
    benefits: ['Enhances numerical reasoning', 'Improves mental calculation speed', 'Keeps the brain active']
  },
  {
    id: 'music-therapy',
    name: 'Musical Memory',
    description: 'Remember and replay musical patterns',
    icon: <Music className="h-8 w-8 text-health-primary" />,
    component: MusicTherapyGame,
    benefits: ['Improves auditory memory', 'Enhances concentration', 'Provides stress relief through music']
  },
  {
    id: 'coordination',
    name: 'Coordination Challenge',
    description: 'Games that improve your hand-eye coordination and reflexes',
    icon: <Gamepad className="h-8 w-8 text-health-primary" />,
    component: ReactionGame,
    benefits: ['Enhances motor skills', 'Improves coordination', 'Helps with daily activities']
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Moments',
    description: 'Short mindfulness exercises for mental clarity and focus',
    icon: <Bell className="h-8 w-8 text-health-primary" />,
    component: BreathingExercise,
    benefits: ['Reduces stress', 'Improves attention', 'Promotes emotional well-being']
  },
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    description: 'Guided breathing exercise for stress and anxiety relief',
    icon: <Activity className="h-8 w-8 text-health-primary" />,
    component: BreathingExercise,
    benefits: ['Reduces stress and anxiety', 'Improves lung function', 'Helps with mindfulness']
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    description: 'Progressive relaxation technique for whole-body awareness',
    icon: <Headphones className="h-8 w-8 text-health-primary" />,
    component: BreathingExercise, // Reusing component but for body scan meditation
    benefits: ['Relieves physical tension', 'Improves body awareness', 'Promotes deep relaxation']
  }
];

interface GamesListProps {
  compact?: boolean;
}

const GamesList = ({ compact = false }: GamesListProps) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { startGameSession, suggestedGames } = useGameTracker();
  const { toast } = useToast();

  const handleStartGame = (gameId: string) => {
    startGameSession(gameId);
    setActiveGame(gameId);
    toast(`Starting ${games.find(g => g.id === gameId)?.name}. Your time will be tracked for research purposes.`);
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
      
      {compact ? (
        // Compact view for sidebar
        <div className="space-y-2">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleStartGame(game.id)}
              className="w-full text-left p-2 rounded-md hover:bg-muted flex items-center gap-2 transition-colors"
            >
              <div className="p-1 bg-health-primary/10 rounded-md">
                {game.icon}
              </div>
              <div>
                <div className="font-medium">{game.name}</div>
                <div className="text-sm text-muted-foreground truncate">{game.description}</div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        // Full card view for games page
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <Card key={game.id} className="game-card hover:border-health-primary animate-fade-in flex flex-col">
              <CardHeader className="pb-2">
                <div className="mb-2">{game.icon}</div>
                <CardTitle>{game.name}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="space-y-2 flex-grow">
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
      )}
    </div>
  );
};

export default GamesList;

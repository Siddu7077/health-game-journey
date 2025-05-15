
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Timer } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface ReactionGameProps {
  onExit: () => void;
}

enum GameState {
  WAITING,
  READY,
  CLICKED,
  RESULTS
}

const ReactionGame: React.FC<ReactionGameProps> = ({ onExit }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [countDown, setCountDown] = useState<number>(3);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startGame = () => {
    setGameState(GameState.WAITING);
    setCountDown(3);
    
    const countdownInterval = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setupReactionTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const setupReactionTest = () => {
    // Random delay between 1-5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;
    
    timeoutRef.current = setTimeout(() => {
      setGameState(GameState.READY);
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (gameState === GameState.WAITING) {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      toast({
        title: "Too early!",
        description: "Wait for the green screen before clicking",
        variant: "destructive"
      });
      startGame();
    } else if (gameState === GameState.READY) {
      // Valid click, calculate reaction time
      const endTime = Date.now();
      const time = startTime ? endTime - startTime : 0;
      setReactionTime(time);
      
      // Update best time
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      
      // Add to attempts
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      
      setGameState(GameState.CLICKED);
      
      // If 5 attempts completed, show results
      if (newAttempts.length >= 5) {
        setGameState(GameState.RESULTS);
        endGameSession('reaction', { 
          bestTime: Math.min(...newAttempts),
          averageTime: newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length,
          attempts: newAttempts
        });
      }
    } else if (gameState === GameState.CLICKED) {
      // Ready for next attempt
      startGame();
    }
  };

  const handleExitGame = () => {
    if (attempts.length > 0) {
      endGameSession('reaction', { 
        bestTime: bestTime || 0,
        averageTime: attempts.reduce((a, b) => a + b, 0) / attempts.length,
        attempts,
        completed: attempts.length >= 5
      });
    }
    onExit();
  };

  const handleSubmitFeedback = () => {
    toast({
      title: "Thank You!",
      description: "Your feedback helps us improve our games.",
    });
    onExit();
  };

  if (gameState === GameState.RESULTS) {
    const avgTime = attempts.reduce((a, b) => a + b, 0) / attempts.length;
    return (
      <FeedbackForm 
        gameId="reaction" 
        gameName="Reaction Time"
        onSubmit={handleSubmitFeedback}
        stats={`Best time: ${bestTime}ms, Average time: ${Math.round(avgTime)}ms`}
      />
    );
  }

  let backgroundColor = 'bg-gray-100';
  let instruction = 'Click when the screen turns green';
  
  if (gameState === GameState.WAITING && countDown > 0) {
    backgroundColor = 'bg-amber-50';
    instruction = `Get ready... ${countDown}`;
  } else if (gameState === GameState.WAITING) {
    backgroundColor = 'bg-red-100';
    instruction = 'Wait...';
  } else if (gameState === GameState.READY) {
    backgroundColor = 'bg-green-100';
    instruction = 'Click now!';
  } else if (gameState === GameState.CLICKED) {
    backgroundColor = 'bg-blue-100';
    instruction = reactionTime ? `Your time: ${reactionTime}ms - Click to continue` : 'Continue';
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Reaction Time</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Test and improve your reaction speed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`w-full aspect-video rounded-lg flex items-center justify-center cursor-pointer transition-colors ${backgroundColor}`}
          onClick={handleClick}
        >
          <div className="text-center">
            <p className="text-xl font-medium mb-2">{instruction}</p>
            {gameState === GameState.CLICKED && reactionTime && (
              <p className="text-sm text-gray-600">
                {bestTime !== null && reactionTime === bestTime
                  ? '🏆 New best time!'
                  : `Best time: ${bestTime}ms`}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Attempts: {attempts.length}/5</p>
            {bestTime !== null && (
              <p className="text-sm font-medium">Best: {bestTime}ms</p>
            )}
          </div>
          
          {attempts.length > 0 && (
            <div className="mt-2 flex gap-1">
              {attempts.map((time, index) => (
                <div 
                  key={index} 
                  className="h-2 flex-1 rounded-full"
                  style={{ 
                    backgroundColor: bestTime === time ? '#4FD1C5' : '#B2F5EA',
                    opacity: (1 - (time - (bestTime || time)) / 500).toFixed(2)
                  }}
                  title={`${time}ms`}
                ></div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleExitGame}>
          Exit Game
        </Button>
        {gameState === GameState.WAITING || gameState === GameState.CLICKED ? (
          <Button variant="outline" onClick={startGame} disabled={gameState === GameState.WAITING && countDown > 0}>
            {gameState === GameState.WAITING && countDown > 0 ? 'Starting...' : 'Restart'}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default ReactionGame;

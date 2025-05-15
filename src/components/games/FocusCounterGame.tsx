
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Brain, Plus, Minus } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface FocusCounterGameProps {
  onExit: () => void;
}

type GameShape = {
  id: number;
  type: 'target' | 'distractor';
  color: string;
  shape: 'circle' | 'square' | 'triangle';
  size: 'small' | 'medium' | 'large';
};

const FocusCounterGame: React.FC<FocusCounterGameProps> = ({ onExit }) => {
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [shapes, setShapes] = useState<GameShape[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [targetShape, setTargetShape] = useState<{
    shape: 'circle' | 'square' | 'triangle';
    color: string;
  } | null>(null);
  
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const colors = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500'];
  const shapeTypes = ['circle', 'square', 'triangle'];

  // Start game setup
  useEffect(() => {
    if (isPlaying) {
      generateNewLevel();
    }
  }, [isPlaying, level]);

  // Timer countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      checkAnswer();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    setUserCount(0);
  };

  const generateNewLevel = () => {
    // Choose target shape and color
    const targetShapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)] as 'circle' | 'square' | 'triangle';
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    setTargetShape({
      shape: targetShapeType,
      color: targetColor
    });
    
    // Calculate number of shapes based on level
    const baseShapes = 10;
    const totalShapes = baseShapes + (level * 3);
    
    // Calculate target count (between 3 and 1/3 of total shapes)
    const minTargets = 3;
    const maxTargets = Math.max(3, Math.floor(totalShapes / 3));
    const targetCount = Math.floor(Math.random() * (maxTargets - minTargets + 1)) + minTargets;
    
    setCorrectCount(targetCount);
    
    // Generate shapes array
    const newShapes: GameShape[] = [];
    
    // Add target shapes
    for (let i = 0; i < targetCount; i++) {
      newShapes.push({
        id: i,
        type: 'target',
        color: targetColor,
        shape: targetShapeType,
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large'
      });
    }
    
    // Add distractor shapes
    for (let i = 0; i < totalShapes - targetCount; i++) {
      // Ensure distractors are different from target (either color or shape must differ)
      let distractorShape: 'circle' | 'square' | 'triangle';
      let distractorColor: string;
      
      if (Math.random() > 0.5) {
        // Different shape, same color (for harder difficulty)
        do {
          distractorShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)] as 'circle' | 'square' | 'triangle';
        } while (distractorShape === targetShapeType);
        distractorColor = targetColor;
      } else {
        // Different color, same shape (for harder difficulty)
        do {
          distractorColor = colors[Math.floor(Math.random() * colors.length)];
        } while (distractorColor === targetColor);
        distractorShape = targetShapeType;
      }
      
      newShapes.push({
        id: targetCount + i,
        type: 'distractor',
        color: distractorColor,
        shape: distractorShape,
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large'
      });
    }
    
    // Shuffle shapes
    for (let i = newShapes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newShapes[i], newShapes[j]] = [newShapes[j], newShapes[i]];
    }
    
    setShapes(newShapes);
    setUserCount(0);
    setTimeLeft(Math.max(10, 30 - (level * 2))); // Reduce time as level increases
  };

  const checkAnswer = () => {
    if (userCount === correctCount) {
      // Correct!
      toast("Correct count! Great job!");
      setScore(score + (level * 10));
      
      // Level up every 2 correct answers
      if (score > 0 && score % 20 === 0) {
        setLevel(level + 1);
        toast(`Level up! Now at level ${level + 1}`);
      }
      
      generateNewLevel();
    } else {
      // Wrong
      toast(`Wrong! There were ${correctCount} ${targetShape?.shape}s.`);
      setLives(lives - 1);
      
      if (lives <= 1) {
        endGame();
      } else {
        generateNewLevel();
      }
    }
  };

  const incrementCount = () => {
    setUserCount(prev => Math.min(prev + 1, shapes.length));
  };

  const decrementCount = () => {
    setUserCount(prev => Math.max(prev - 1, 0));
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    endGameSession('focus-counter', { 
      score,
      level,
      completed: true
    });
    toast(`Game over! Final score: ${score}`);
  };

  const handleExitGame = () => {
    if (isPlaying) {
      endGameSession('focus-counter', { 
        score,
        level,
        completed: false
      });
    }
    onExit();
  };

  const handleSubmitFeedback = () => {
    toast("Thank You! Your feedback helps us improve our games.");
    onExit();
  };

  // Render shape based on shape name
  const renderShape = (shape: GameShape) => {
    const sizeClass = {
      small: 'w-8 h-8',
      medium: 'w-10 h-10',
      large: 'w-12 h-12'
    }[shape.size];
    
    switch (shape.shape) {
      case 'circle':
        return <div className={`${shape.color} border-2 border-current ${sizeClass} rounded-full`}></div>;
      case 'square':
        return <div className={`${shape.color} border-2 border-current ${sizeClass}`}></div>;
      case 'triangle':
        return (
          <div className={`${shape.color} ${sizeClass}`} style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            border: '2px solid currentColor'
          }}></div>
        );
      default:
        return <div className={`${shape.color} border-2 border-current ${sizeClass} rounded-full`}></div>;
    }
  };

  if (isGameOver) {
    return (
      <FeedbackForm 
        gameId="focus-counter" 
        gameName="Focus Counter"
        onSubmit={handleSubmitFeedback}
        stats={`Final score: ${score}, Level reached: ${level}`}
      />
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Focus Counter</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Count specific objects while ignoring distractions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPlaying ? (
          <>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium">Level:</span>
                <span className="text-sm ml-1">{level}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Score:</span>
                <span className="text-sm ml-1">{score}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Lives:</span>
                <span className="text-sm ml-1">{lives}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Time:</span>
                <span className={`text-sm ml-1 ${timeLeft <= 5 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
              </div>
            </div>

            {targetShape && (
              <div className="bg-muted p-3 rounded-md flex items-center justify-center space-x-3">
                <span>Count all</span>
                <div className={`${targetShape.color} inline-block`}>
                  {targetShape.shape === 'circle' && (
                    <div className="w-6 h-6 rounded-full border-2 border-current"></div>
                  )}
                  {targetShape.shape === 'square' && (
                    <div className="w-6 h-6 border-2 border-current"></div>
                  )}
                  {targetShape.shape === 'triangle' && (
                    <div className="w-6 h-6" style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      border: '2px solid currentColor'
                    }}></div>
                  )}
                </div>
                <span>shapes</span>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-5 gap-2 justify-items-center">
                {shapes.map(shape => (
                  <div key={shape.id} className="flex justify-center items-center">
                    {renderShape(shape)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 my-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decrementCount}
                disabled={userCount <= 0}
              >
                <Minus size={18} />
              </Button>
              <span className="text-2xl font-bold w-12 text-center">{userCount}</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={incrementCount}
                disabled={userCount >= shapes.length}
              >
                <Plus size={18} />
              </Button>
            </div>

            <Button className="w-full" onClick={checkAnswer}>Submit Count</Button>
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <Brain size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Focus Counter Challenge</h3>
            <p className="text-muted-foreground">
              Train your selective attention by quickly counting target shapes among distractions.
            </p>
            <Button onClick={startGame} className="w-full">Start Game</Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleExitGame}>
          Exit Game
        </Button>
        {isPlaying && (
          <Button variant="outline" onClick={endGame}>
            End Game
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FocusCounterGame;

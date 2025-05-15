
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Puzzle } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface PatternMatchGameProps {
  onExit: () => void;
}

type PatternItem = {
  color: string;
  shape: string;
};

const PatternMatchGame: React.FC<PatternMatchGameProps> = ({ onExit }) => {
  const [level, setLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [targetPattern, setTargetPattern] = useState<PatternItem[]>([]);
  const [options, setOptions] = useState<PatternItem[][]>([]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number | null>(null);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
  const shapes = ['circle', 'square', 'triangle', 'diamond', 'star'];

  useEffect(() => {
    if (isPlaying) {
      generateNewPattern();
    }
  }, [isPlaying, level]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setLevel(1);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setIsGameOver(false);
  };

  const generateNewPattern = () => {
    // Generate target pattern based on level
    const patternLength = Math.min(2 + Math.floor(level / 2), 5); // Max 5 items
    const newPattern: PatternItem[] = [];
    
    for (let i = 0; i < patternLength; i++) {
      newPattern.push({
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      });
    }
    
    setTargetPattern(newPattern);
    
    // Generate options (including the correct one)
    const correctOption = [...newPattern];
    const newOptions: PatternItem[][] = [correctOption];
    
    // Generate incorrect options
    for (let i = 0; i < 3; i++) {
      const incorrectOption = [...newPattern];
      
      // Modify 1 or 2 items depending on level
      const changesToMake = Math.min(1 + Math.floor(level / 4), 2);
      
      for (let j = 0; j < changesToMake; j++) {
        const itemToChange = Math.floor(Math.random() * incorrectOption.length);
        const changeColor = Math.random() > 0.5;
        
        if (changeColor) {
          let newColor;
          do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
          } while (newColor === incorrectOption[itemToChange].color);
          
          incorrectOption[itemToChange] = {
            ...incorrectOption[itemToChange],
            color: newColor
          };
        } else {
          let newShape;
          do {
            newShape = shapes[Math.floor(Math.random() * shapes.length)];
          } while (newShape === incorrectOption[itemToChange].shape);
          
          incorrectOption[itemToChange] = {
            ...incorrectOption[itemToChange],
            shape: newShape
          };
        }
      }
      
      newOptions.push(incorrectOption);
    }
    
    // Shuffle options
    for (let i = newOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOptions[i], newOptions[j]] = [newOptions[j], newOptions[i]];
    }
    
    setOptions(newOptions);
    
    // Find where the correct option ended up after shuffling
    for (let i = 0; i < newOptions.length; i++) {
      if (arePatternsSame(newOptions[i], correctOption)) {
        setCorrectOptionIndex(i);
        break;
      }
    }
  };

  const arePatternsSame = (pattern1: PatternItem[], pattern2: PatternItem[]): boolean => {
    if (pattern1.length !== pattern2.length) return false;
    
    for (let i = 0; i < pattern1.length; i++) {
      if (pattern1[i].color !== pattern2[i].color || pattern1[i].shape !== pattern2[i].shape) {
        return false;
      }
    }
    
    return true;
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (optionIndex === correctOptionIndex) {
      // Correct answer
      const levelUp = score > 0 && score % 5 === 0;
      const newLevel = levelUp ? level + 1 : level;
      const pointsEarned = level * 10;
      
      setScore(prev => prev + 1);
      
      if (levelUp) {
        setLevel(newLevel);
        toast(`Level up! Now at level ${newLevel}`);
        
        // Add some bonus time on level up
        setTimeLeft(prev => Math.min(prev + 10, 60));
      } else {
        // Add a small time bonus for correct answers
        setTimeLeft(prev => Math.min(prev + 2, 60));
      }
      
      toast(`Correct! +${pointsEarned} points`);
      generateNewPattern();
    } else {
      // Incorrect answer
      toast("Incorrect pattern match! Try again.");
      setTimeLeft(prev => Math.max(prev - 3, 1)); // Penalty
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    endGameSession('pattern-match', { 
      score,
      level,
      completed: true
    });
    toast(`Game over! Final score: ${score}`);
  };

  const handleExitGame = () => {
    if (isPlaying) {
      endGameSession('pattern-match', { 
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
  const renderShape = (item: PatternItem, size: 'sm' | 'md') => {
    const sizeClass = size === 'sm' ? 'w-8 h-8' : 'w-12 h-12';
    
    switch (item.shape) {
      case 'circle':
        return <div className={`${item.color} ${sizeClass} rounded-full`}></div>;
      case 'square':
        return <div className={`${item.color} ${sizeClass}`}></div>;
      case 'triangle':
        return (
          <div className={`${item.color} ${sizeClass} clip-triangle`} 
               style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
        );
      case 'diamond':
        return (
          <div className={`${item.color} ${sizeClass}`} 
               style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
        );
      case 'star':
        return (
          <div className={`${item.color} ${sizeClass}`} 
               style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        );
      default:
        return <div className={`${item.color} ${sizeClass} rounded-full`}></div>;
    }
  };

  if (isGameOver) {
    return (
      <FeedbackForm 
        gameId="pattern-match" 
        gameName="Pattern Matching"
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
          <CardTitle className="text-xl font-semibold">Pattern Matching</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Find the matching pattern to train your visual processing skills
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
                <span className="text-sm font-medium">Time:</span>
                <span className={`text-sm ml-1 ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <p className="text-center text-sm font-medium mb-2">Target Pattern</p>
              <div className="flex justify-center items-center gap-3 py-2">
                {targetPattern.map((item, index) => (
                  <div key={index} className="flex justify-center">
                    {renderShape(item, 'md')}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-sm font-medium">Find the Matching Pattern</p>
              <div className="grid grid-cols-2 gap-2">
                {options.map((option, optionIndex) => (
                  <Button
                    key={optionIndex}
                    variant="outline"
                    className="p-3 h-auto hover:border-health-primary"
                    onClick={() => handleOptionSelect(optionIndex)}
                  >
                    <div className="flex justify-center items-center gap-2">
                      {option.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          {renderShape(item, 'sm')}
                        </div>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <Puzzle size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Pattern Matching Challenge</h3>
            <p className="text-muted-foreground">
              Test your visual processing skills by quickly identifying matching patterns.
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

export default PatternMatchGame;

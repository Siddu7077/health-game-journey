
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface MathChallengeGameProps {
  onExit: () => void;
}

type MathProblem = {
  question: string;
  answer: number;
};

const MathChallengeGame: React.FC<MathChallengeGameProps> = ({ onExit }) => {
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [currentProblem, setCurrentProblem] = useState<MathProblem>({ question: '', answer: 0 });
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  // Start game and setup timer
  useEffect(() => {
    if (isPlaying) {
      generateNewProblem();
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
      endGame();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
  };

  const generateNewProblem = () => {
    let num1: number, num2: number, operation: string, answer: number;
    
    // Adjust difficulty based on level
    switch (level) {
      case 1: // Simple addition/subtraction with small numbers
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num2 > num1) {
          // Swap to avoid negative
          [num1, num2] = [num2, num1];
        }
        break;
      
      case 2: // Addition/subtraction with larger numbers
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        break;
        
      case 3: // Introduces multiplication
        if (Math.random() > 0.3) {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          operation = '*';
        } else {
          num1 = Math.floor(Math.random() * 30) + 10;
          num2 = Math.floor(Math.random() * 30) + 1;
          operation = Math.random() > 0.5 ? '+' : '-';
        }
        break;
        
      case 4: // All operations
        if (Math.random() > 0.5) {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          operation = Math.random() > 0.5 ? '*' : '/';
          if (operation === '/') {
            // Ensure clean division
            num1 = num1 * num2;
          }
        } else {
          num1 = Math.floor(Math.random() * 50) + 10;
          num2 = Math.floor(Math.random() * 50) + 1;
          operation = Math.random() > 0.5 ? '+' : '-';
        }
        break;
        
      default: // Level 5+ - harder operations
        if (Math.random() > 0.3) {
          num1 = Math.floor(Math.random() * 20) + 5;
          num2 = Math.floor(Math.random() * 10) + 2;
          operation = Math.random() > 0.5 ? '*' : '/';
          if (operation === '/') {
            // Ensure clean division
            num1 = num1 * num2;
          }
        } else {
          num1 = Math.floor(Math.random() * 100) + 20;
          num2 = Math.floor(Math.random() * 100) + 1;
          operation = Math.random() > 0.5 ? '+' : '-';
        }
    }
    
    // Calculate answer
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        answer = num1 / num2;
        break;
      default:
        answer = num1 + num2;
    }
    
    setCurrentProblem({
      question: `${num1} ${operation} ${num2} = ?`,
      answer
    });
    
    setUserAnswer('');
  };

  const checkAnswer = () => {
    const userNum = parseFloat(userAnswer);
    
    if (isNaN(userNum)) {
      toast("Please enter a valid number");
      return;
    }
    
    if (userNum === currentProblem.answer) {
      // Correct answer
      toast("Correct!");
      setScore(score + (level * 10));
      setCorrectAnswers(correctAnswers + 1);
      
      // Add time bonus
      setTimeLeft(prev => Math.min(prev + 2, 30));
      
      // Level up based on correct answers
      if (correctAnswers > 0 && correctAnswers % 5 === 0) {
        const newLevel = Math.min(level + 1, 5);
        setLevel(newLevel);
        toast(`Level up! Now at level ${newLevel}`);
      }
      
      generateNewProblem();
    } else {
      // Wrong answer
      toast(`Incorrect! The answer was ${currentProblem.answer}`);
      setIncorrectAnswers(incorrectAnswers + 1);
      
      // Reduce time as penalty
      setTimeLeft(prev => Math.max(prev - 3, 1));
      
      generateNewProblem();
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    endGameSession('math-challenge', { 
      score,
      level,
      correctAnswers,
      incorrectAnswers,
      accuracy: correctAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0,
      completed: true
    });
    toast(`Game over! Final score: ${score}`);
  };

  const handleExitGame = () => {
    if (isPlaying) {
      endGameSession('math-challenge', { 
        score,
        level,
        correctAnswers,
        incorrectAnswers,
        completed: false
      });
    }
    onExit();
  };

  const handleSubmitFeedback = () => {
    toast("Thank You! Your feedback helps us improve our games.");
    onExit();
  };

  if (isGameOver) {
    return (
      <FeedbackForm 
        gameId="math-challenge" 
        gameName="Mental Math"
        onSubmit={handleSubmitFeedback}
        stats={`Score: ${score}, Correct answers: ${correctAnswers}, Accuracy: ${
          correctAnswers > 0 ? Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100) : 0
        }%`}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Mental Math</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Quick arithmetic challenges to boost brain power
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

            <div className="bg-muted p-6 rounded-md text-center">
              <p className="text-3xl font-bold mb-4">{currentProblem.question}</p>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={userAnswer} 
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="text-center text-xl"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      checkAnswer();
                    }
                  }}
                  autoFocus
                />
                <Button onClick={checkAnswer}>Submit</Button>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <span className="font-medium">Correct:</span> {correctAnswers}
              </div>
              <div>
                <span className="font-medium">Incorrect:</span> {incorrectAnswers}
              </div>
              <div>
                <span className="font-medium">Accuracy:</span> {
                  correctAnswers > 0 
                    ? `${Math.round((correctAnswers / (correctAnswers + incorrectAnswers)) * 100)}%`
                    : '0%'
                }
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <Dumbbell size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Mental Math Challenge</h3>
            <p className="text-muted-foreground">
              Solve math problems quickly to keep your brain active and improve numerical reasoning.
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

export default MathChallengeGame;

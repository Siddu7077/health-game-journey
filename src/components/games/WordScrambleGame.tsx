
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface WordScrambleGameProps {
  onExit: () => void;
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ onExit }) => {
  const [scrambledWord, setScrambledWord] = useState<string>('');
  const [originalWord, setOriginalWord] = useState<string>('');
  const [userGuess, setUserGuess] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const words = [
    'health', 'wellness', 'exercise', 'mindful', 'breathe', 
    'fitness', 'therapy', 'balance', 'strength', 'healing',
    'tranquil', 'peaceful', 'harmony', 'vitality', 'relax',
    'recovery', 'calming', 'soothing', 'energize', 'refresh'
  ];

  const scrambleWord = (word: string): string => {
    const characters = word.split('');
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    return characters.join('');
  };

  const selectNewWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(word);
    
    let scrambled = scrambleWord(word);
    // Make sure scrambled word is different from original
    while (scrambled === word) {
      scrambled = scrambleWord(word);
    }
    
    setScrambledWord(scrambled);
    setUserGuess('');
  };

  const startGame = () => {
    setScore(0);
    setRounds(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    selectNewWord();
  };

  const checkAnswer = () => {
    if (userGuess.toLowerCase() === originalWord) {
      toast("Correct!");
      setScore(score + 1);
      selectNewWord();
      setRounds(rounds + 1);
    } else {
      toast("Not quite right, try again!");
    }
    setUserGuess('');
  };

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

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    endGameSession('word-scramble', { 
      score, 
      rounds, 
      completed: true 
    });
    toast(`Game over! You unscrambled ${score} words correctly.`);
  };

  const handleExitGame = () => {
    if (isPlaying) {
      endGameSession('word-scramble', { 
        score, 
        rounds, 
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
        gameId="word-scramble" 
        gameName="Word Scramble"
        onSubmit={handleSubmitFeedback}
        stats={`You unscrambled ${score} words out of ${rounds} attempts!`}
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
          <CardTitle className="text-xl font-semibold">Word Scramble</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Unscramble words to boost vocabulary and cognitive skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPlaying ? (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Score:</span>
                <span className="text-sm">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Time:</span>
                <span className={`text-sm ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-md text-center">
              <p className="text-2xl font-bold tracking-wider mb-1">{scrambledWord}</p>
              <p className="text-sm text-muted-foreground">Unscramble the word above</p>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="Your answer"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    checkAnswer();
                  }
                }}
                autoFocus
              />
              <Button onClick={checkAnswer}>Submit</Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <BookOpen size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Word Scramble Challenge</h3>
            <p className="text-muted-foreground">
              Test your vocabulary skills by unscrambling words against the clock!
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

export default WordScrambleGame;

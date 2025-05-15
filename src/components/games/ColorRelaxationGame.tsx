
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Heart } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface ColorRelaxationGameProps {
  onExit: () => void;
}

const ColorRelaxationGame: React.FC<ColorRelaxationGameProps> = ({ onExit }) => {
  const [currentColor, setCurrentColor] = useState<string>('#7DD3FC'); // Light blue start
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [sessionLength, setSessionLength] = useState<number>(60); // seconds
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [sessionStats, setSessionStats] = useState({
    colorChanges: 0,
    totalBreaths: 0,
    duration: 0,
  });
  
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const colorSequence = [
    { color: '#7DD3FC', name: 'light blue', emotion: 'calm' },      // Light blue
    { color: '#A7F3D0', name: 'mint green', emotion: 'refreshed' }, // Mint green
    { color: '#C4B5FD', name: 'lavender', emotion: 'peaceful' },    // Lavender
    { color: '#FDE68A', name: 'soft yellow', emotion: 'joyful' },   // Soft yellow
    { color: '#FDBA74', name: 'peach', emotion: 'warm' },           // Peach
    { color: '#F9A8D4', name: 'pink', emotion: 'loving' },          // Pink
  ];

  const prompts = [
    "Notice how this color makes you feel",
    "Breathe deeply as the color surrounds you",
    "Let the color wash away your tension",
    "Imagine the color healing your body",
    "Feel the energy of this color",
    "Allow yourself to melt into this color",
  ];

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let breathTimer: ReturnType<typeof setInterval>;
    
    if (isActive) {
      // Main session timer
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Breathing and color change timer
      breathTimer = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'inhale') {
            return 'hold';
          } else if (prev === 'hold') {
            return 'exhale';
          } else {
            // On exhale complete, change color and reset to inhale
            changeColor();
            setSessionStats(prev => ({
              ...prev,
              totalBreaths: prev.totalBreaths + 1,
              colorChanges: prev.colorChanges + 1,
            }));
            return 'inhale';
          }
        });
      }, 4000); // Change every 4 seconds (12 second complete breath cycle)
    }
    
    return () => {
      if (timer) clearInterval(timer);
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [isActive]);
  
  useEffect(() => {
    if (breathPhase === 'inhale') {
      setCurrentPrompt("Breathe in slowly...");
    } else if (breathPhase === 'hold') {
      setCurrentPrompt("Hold your breath gently...");
    } else {
      setCurrentPrompt("Breathe out slowly...");
    }
  }, [breathPhase]);

  const changeColor = () => {
    const randomIndex = Math.floor(Math.random() * colorSequence.length);
    setCurrentColor(colorSequence[randomIndex].color);
    
    if (Math.random() > 0.5) {
      // Sometimes change the prompt too
      const randomPromptIndex = Math.floor(Math.random() * prompts.length);
      setCurrentPrompt(prompts[randomPromptIndex]);
    }
  };

  const startSession = (length: number) => {
    setSessionLength(length);
    setTimeRemaining(length);
    setSessionStats({
      colorChanges: 0,
      totalBreaths: 0,
      duration: length,
    });
    setIsActive(true);
    setIsComplete(false);
    changeColor();
    toast("Color relaxation session started. Breathe with the prompts.");
  };

  const completeSession = () => {
    setIsActive(false);
    setIsComplete(true);
    endGameSession('color-relaxation', {
      duration: sessionLength,
      colorChanges: sessionStats.colorChanges,
      totalBreaths: sessionStats.totalBreaths,
      completed: true
    });
    toast("Session complete! How do you feel?");
  };

  const handleExitGame = () => {
    if (isActive) {
      endGameSession('color-relaxation', {
        duration: sessionLength - timeRemaining,
        colorChanges: sessionStats.colorChanges,
        totalBreaths: sessionStats.totalBreaths,
        completed: false
      });
    }
    onExit();
  };

  const handleSubmitFeedback = () => {
    toast("Thank You! Your feedback helps us improve our experience.");
    onExit();
  };

  if (isComplete) {
    return (
      <FeedbackForm 
        gameId="color-relaxation" 
        gameName="Color Therapy"
        onSubmit={handleSubmitFeedback}
        stats={`Session: ${sessionLength} seconds, Breaths: ${sessionStats.totalBreaths}`}
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
          <CardTitle className="text-xl font-semibold">Color Therapy</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Relax and breathe with color-based mindfulness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isActive ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm">
                <span className="font-medium">Time remaining:</span> {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </div>
              <div className="text-sm">
                <span className="font-medium">Breath phase:</span> {breathPhase}
              </div>
            </div>
            
            <div 
              className="aspect-video rounded-lg flex items-center justify-center transition-colors duration-1000"
              style={{ backgroundColor: currentColor }}
            >
              <div className="text-center p-6">
                <p className="text-2xl font-light text-white drop-shadow-md">
                  {currentPrompt}
                </p>
                <div 
                  className={`w-16 h-16 mx-auto mt-4 rounded-full bg-white/30 transition-transform duration-4000 
                    ${breathPhase === 'inhale' ? 'scale-100' : breathPhase === 'hold' ? 'scale-110' : 'scale-90'}`}
                ></div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <Heart size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Color Relaxation Therapy</h3>
            <p className="text-muted-foreground">
              Experience the calming effects of color therapy combined with guided breathing.
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={() => startSession(60)} className="w-full">1 Minute Session</Button>
              <Button onClick={() => startSession(180)} className="w-full">3 Minute Session</Button>
              <Button onClick={() => startSession(300)} className="w-full">5 Minute Session</Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleExitGame}>
          Exit
        </Button>
        {isActive && (
          <Button variant="outline" onClick={completeSession}>
            End Session
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ColorRelaxationGame;

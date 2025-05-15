import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface BreathingExerciseProps {
  onExit: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onExit }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const phaseConfig = {
    inhale: { duration: 4, message: 'Breathe in slowly...', color: 'bg-blue-100' },
    hold: { duration: 7, message: 'Hold your breath...', color: 'bg-green-100' },
    exhale: { duration: 8, message: 'Breathe out slowly...', color: 'bg-purple-100' },
    rest: { duration: 2, message: 'Relax...', color: 'bg-amber-50' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            // Move to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                return phaseConfig.hold.duration;
              case 'hold':
                setPhase('exhale');
                return phaseConfig.exhale.duration;
              case 'exhale':
                setPhase('rest');
                return phaseConfig.rest.duration;
              case 'rest':
                setPhase('inhale');
                setCyclesCompleted((prev) => prev + 1);
                return phaseConfig.inhale.duration;
            }
          }
          return prevSeconds - 1;
        });
        
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase]);

  useEffect(() => {
    if (cyclesCompleted >= 3 && phase === 'rest') {
      completeExercise();
    }
  }, [cyclesCompleted, phase]);

  const startExercise = () => {
    setIsActive(true);
    toast("Exercise started. Follow the breathing instructions.");
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(phaseConfig.inhale.duration);
    setCyclesCompleted(0);
    setTotalTimeSpent(0);
  };

  const completeExercise = () => {
    setIsActive(false);
    endGameSession('breathing', { cyclesCompleted, totalTimeSpent });
    setShowFeedback(true);
    toast(`Exercise Completed! You completed ${cyclesCompleted} breathing cycles!`);
  };

  const handleExitGame = () => {
    if (isActive || cyclesCompleted > 0) {
      endGameSession('breathing', { cyclesCompleted, totalTimeSpent, completed: phase === 'rest' && cyclesCompleted >= 3 });
    }
    onExit();
  };

  const handleSubmitFeedback = () => {
    toast("Thank You! Your feedback helps us improve our exercises.");
    onExit();
  };

  if (showFeedback) {
    return (
      <FeedbackForm 
        gameId="breathing" 
        gameName="Breathing Exercise"
        onSubmit={handleSubmitFeedback}
        stats={`You completed ${cyclesCompleted} breathing cycles`}
      />
    );
  }

  const progress = 100 - ((secondsLeft / phaseConfig[phase].duration) * 100);

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Breathing Exercise</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={`w-48 h-48 rounded-full mb-6 flex items-center justify-center 
                     transition-all duration-1000 ${phaseConfig[phase].color}`}
             style={{ 
               transform: phase === 'inhale' 
                 ? `scale(${1 + (1 - secondsLeft/phaseConfig.inhale.duration) * 0.2})` 
                 : phase === 'exhale' 
                   ? `scale(${1.2 - (1 - secondsLeft/phaseConfig.exhale.duration) * 0.2})` 
                   : 'scale(1.2)' 
             }}>
          <div className="text-3xl font-semibold">{secondsLeft}</div>
        </div>
        
        <h3 className="text-xl font-medium mb-4">
          {phaseConfig[phase].message}
        </h3>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-health-primary h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex flex-col items-center space-y-3 w-full">
          <div className="flex items-center justify-center gap-3 w-full">
            <p className="text-sm">Cycles: {cyclesCompleted}/3</p>
            <p className="text-sm">Total time: {Math.floor(totalTimeSpent / 60)}:{(totalTimeSpent % 60).toString().padStart(2, '0')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            {isActive ? (
              <Button onClick={pauseExercise} className="flex gap-2 items-center">
                <Pause size={18} />
                Pause
              </Button>
            ) : (
              <Button onClick={startExercise} className="bg-health-primary hover:bg-health-secondary flex gap-2 items-center">
                <Play size={18} />
                {totalTimeSpent > 0 ? 'Resume' : 'Start'}
              </Button>
            )}
            <Button onClick={resetExercise} variant="outline">Reset</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          This exercise uses the 4-7-8 breathing technique to reduce stress and anxiety.
        </p>
      </CardFooter>
    </Card>
  );
};

export default BreathingExercise;

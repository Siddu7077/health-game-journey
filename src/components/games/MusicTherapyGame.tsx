
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Music, Play, Volume2, Volume1, VolumeX } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

interface MusicTherapyGameProps {
  onExit: () => void;
}

type Note = {
  id: number;
  color: string;
  sound: string;
  frequency: number;
};

const MusicTherapyGame: React.FC<MusicTherapyGameProps> = ({ onExit }) => {
  const [gameMode, setGameMode] = useState<'free' | 'memory' | 'repeat'>('free');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const notes: Note[] = [
    { id: 0, color: 'bg-red-400', sound: 'C', frequency: 261.63 },
    { id: 1, color: 'bg-yellow-400', sound: 'D', frequency: 293.66 },
    { id: 2, color: 'bg-green-400', sound: 'E', frequency: 329.63 },
    { id: 3, color: 'bg-blue-400', sound: 'G', frequency: 392.00 },
  ];

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start new game
  useEffect(() => {
    if (isPlaying && gameMode !== 'free') {
      startNewLevel();
    }
  }, [isPlaying, level, gameMode]);

  const startGame = (mode: 'free' | 'memory' | 'repeat') => {
    setGameMode(mode);
    setLevel(1);
    setSequence([]);
    setPlayerSequence([]);
    setIsPlaying(true);
    setIsGameOver(false);
    
    if (mode === 'free') {
      toast("Free play mode: Create your own melodies!");
    } else {
      toast(`${mode === 'memory' ? 'Memory' : 'Repeat'} mode started! Listen and repeat the sequence.`);
    }
  };

  const startNewLevel = () => {
    const newSequence = [...sequence];
    
    // Add a new random note to the sequence
    const randomNoteId = Math.floor(Math.random() * notes.length);
    newSequence.push(randomNoteId);
    
    setSequence(newSequence);
    setPlayerSequence([]);
    
    // Play the sequence for the player
    setTimeout(() => playSequence(newSequence), 1000);
  };

  const playSequence = async (notesToPlay: number[]) => {
    setIsPlayingSequence(true);
    
    // Play each note in sequence with delay between
    for (let i = 0; i < notesToPlay.length; i++) {
      const noteId = notesToPlay[i];
      setActiveNote(noteId);
      await playNote(noteId);
      await new Promise(resolve => setTimeout(resolve, 300)); // Gap between notes
      setActiveNote(null);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small pause between notes
    }
    
    setIsPlayingSequence(false);
  };

  const playNote = (noteId: number) => {
    if (!audioContextRef.current || isMuted) return Promise.resolve();
    
    const note = notes.find(n => n.id === noteId);
    if (!note) return Promise.resolve();
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.frequency, audioContextRef.current.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
    
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleNoteClick = (noteId: number) => {
    if (isPlayingSequence) return;
    
    setActiveNote(noteId);
    playNote(noteId);
    
    setTimeout(() => setActiveNote(null), 300);
    
    if (gameMode === 'free') return;
    
    const newPlayerSequence = [...playerSequence, noteId];
    setPlayerSequence(newPlayerSequence);
    
    // Check if this note matches the expected note in the sequence
    if (noteId !== sequence[playerSequence.length]) {
      // Wrong note
      handleWrongSequence();
      return;
    }
    
    // Check if player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      // Player got the sequence right
      toast("Correct sequence!");
      setLevel(level + 1);
      
      // Small delay before starting next level
      setTimeout(() => startNewLevel(), 1000);
    }
  };

  const handleWrongSequence = () => {
    toast("Oops! Wrong sequence. Try again!");
    
    // If it's repeat mode, game over
    if (gameMode === 'repeat') {
      endGame();
    } else {
      // If it's memory mode, replay the sequence
      setPlayerSequence([]);
      setTimeout(() => playSequence(sequence), 1000);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    
    endGameSession('music-therapy', { 
      mode: gameMode,
      level,
      sequenceLength: sequence.length,
      completed: true
    });
    
    toast(`Game over! You reached level ${level}.`);
  };

  const handleExitGame = () => {
    if (isPlaying && gameMode !== 'free') {
      endGameSession('music-therapy', { 
        mode: gameMode,
        level,
        sequenceLength: sequence.length,
        completed: false
      });
    }
    onExit();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume / 100);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleSubmitFeedback = () => {
    toast("Thank You! Your feedback helps us improve our games.");
    onExit();
  };

  const handleReplaySequence = () => {
    if (isPlayingSequence || gameMode === 'free') return;
    playSequence(sequence);
  };

  if (isGameOver) {
    return (
      <FeedbackForm 
        gameId="music-therapy" 
        gameName="Musical Memory"
        onSubmit={handleSubmitFeedback}
        stats={`Mode: ${gameMode}, Level reached: ${level}, Sequence length: ${sequence.length}`}
      />
    );
  }

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Musical Memory</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Test your auditory memory with musical patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPlaying ? (
          <>
            {gameMode !== 'free' && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">Level:</span>
                  <span className="text-sm ml-1">{level}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Sequence:</span>
                  <span className="text-sm ml-1">{playerSequence.length}/{sequence.length}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReplaySequence}
                  disabled={isPlayingSequence}
                >
                  <Play size={14} className="mr-1" /> Replay
                </Button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {notes.map((note) => (
                <button
                  key={note.id}
                  className={`aspect-square rounded-md ${note.color} ${
                    activeNote === note.id ? 'ring-4 ring-white ring-opacity-70 scale-95' : ''
                  } transition-all`}
                  onClick={() => handleNoteClick(note.id)}
                  disabled={isPlayingSequence}
                >
                  <span className="sr-only">Note {note.sound}</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
              >
                {renderVolumeIcon()}
              </Button>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume * 100} 
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            {gameMode === 'free' && (
              <p className="text-sm text-center text-muted-foreground">
                Free play mode: Create your own melodies by tapping the colored buttons
              </p>
            )}
          </>
        ) : (
          <div className="text-center space-y-4 py-8">
            <Music size={48} className="mx-auto text-health-primary" />
            <h3 className="text-xl font-semibold">Musical Memory</h3>
            <p className="text-muted-foreground mb-4">
              Remember and replay musical patterns to improve your auditory memory
            </p>
            
            <div className="space-y-2">
              <Button onClick={() => startGame('free')} className="w-full">
                Free Play Mode
              </Button>
              <Button onClick={() => startGame('memory')} className="w-full">
                Memory Mode
              </Button>
              <Button onClick={() => startGame('repeat')} className="w-full">
                Challenge Mode
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleExitGame}>
          Exit Game
        </Button>
        {isPlaying && gameMode !== 'free' && (
          <Button variant="outline" onClick={endGame}>
            End Game
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MusicTherapyGame;

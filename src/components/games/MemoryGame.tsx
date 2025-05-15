import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/sonner';
import { ArrowLeft, Award } from 'lucide-react';
import { useGameTracker } from '@/contexts/GameTrackerContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FeedbackForm from './FeedbackForm';

type MemoryCard = {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
};

interface MemoryGameProps {
  onExit: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onExit }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const { endGameSession } = useGameTracker();
  const { toast } = useToast();

  const emojis = ['🌈', '🌞', '🌵', '🌸', '🍎', '🍕', '🚀', '🎮'];
  const totalPairs = emojis.length;

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matchedPairs === totalPairs) {
      handleGameOver();
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    const cardValues = [...emojis, ...emojis];
    const shuffledCards = cardValues
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }));

    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsGameOver(false);
  };

  const handleCardClick = (id: number) => {
    // Don't allow more than 2 cards flipped or clicking on already flipped/matched card
    if (flippedCards.length >= 2 || 
        cards[id].flipped || 
        cards[id].matched) {
      return;
    }

    // Flip the card
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);

    // Add card to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].value === cards[secondId].value) {
        // Match found
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, matched: true }
              : card
          ));
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          toast("Match found! Good job!");
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, flipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
    endGameSession('memory', { moves });
    toast(`Congratulations! You completed the game in ${moves} moves!`);
  };

  const handleExitGame = () => {
    if (!isGameOver) {
      endGameSession('memory', { completed: false, moves });
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
        gameId="memory" 
        gameName="Memory Match"
        onSubmit={handleSubmitFeedback}
        stats={`You completed the game in ${moves} moves!`}
      />
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handleExitGame}>
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-semibold">Memory Match</CardTitle>
          <div className="w-9"></div> {/* Empty div for layout balance */}
        </div>
        <CardDescription>
          Match pairs of cards to exercise your memory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Moves:</span>
            <span className="text-sm">{moves}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Pairs:</span>
            <span className="text-sm">{matchedPairs}/{totalPairs}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square flex items-center justify-center rounded-lg text-3xl cursor-pointer transition-all duration-300 ${
                card.flipped || card.matched
                  ? 'bg-health-primary text-white rotate-0'
                  : 'bg-muted text-transparent rotate-y-180'
              } ${card.matched ? 'opacity-60' : 'opacity-100'}`}
            >
              {card.flipped || card.matched ? card.value : '?'}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleExitGame}>
          Exit Game
        </Button>
        <Button variant="outline" onClick={initializeGame}>
          Reset Game
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemoryGame;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/sonner';
import { Star } from 'lucide-react';

interface FeedbackFormProps {
  gameId: string;
  gameName: string;
  onSubmit: () => void;
  stats?: string;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ gameId, gameName, onSubmit, stats }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Send feedback to backend (or simulated here)
    setTimeout(() => {
      console.log({
        gameId,
        rating,
        feedback,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">How was your experience?</CardTitle>
        <CardDescription>
          {`Please rate your experience with ${gameName}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="bg-muted p-3 rounded-md text-center">
            <p className="font-medium">{stats}</p>
          </div>
        )}
        
        <div className="text-center">
          <p className="mb-2 text-sm font-medium">Rating</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`${
                    star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="feedback" className="text-sm font-medium">
            Your Feedback
          </label>
          <Textarea
            id="feedback"
            placeholder="What did you like or dislike about this game? How could we improve it?"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button variant="outline" onClick={onSubmit}>
          Skip
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || rating === 0}
          className="bg-health-primary hover:bg-health-secondary"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeedbackForm;


import { useAuth } from '@/contexts/AuthContext';
import GamesList from '@/components/games/GamesList';
import AuthForm from '@/components/auth/AuthForm';

const GamesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Access Games</h1>
        <AuthForm />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Therapeutic Games</h1>
      <GamesList />
    </div>
  );
};

export default GamesPage;

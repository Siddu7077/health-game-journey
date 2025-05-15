
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthPage = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Welcome to HealthGames</h1>
      <AuthForm />
    </div>
  );
};

export default AuthPage;

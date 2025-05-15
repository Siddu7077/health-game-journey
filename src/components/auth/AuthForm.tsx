
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'prefer-not-to-say'
  });
  
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
      } else {
        await signup(formData);
        toast({
          title: "Account created successfully",
          description: "Welcome to Health Games!",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: isLogin ? "Invalid credentials. Please try again." : "Failed to create account.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-health-dark">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? 'Login to access your personal health assistant' 
            : 'Sign up to get started with personalized health games'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age
                </label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required={!isLogin}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-border rounded-md"
                  required={!isLogin}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-health-primary hover:bg-health-secondary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isLogin ? (
                  <>
                    <LogIn size={18} /> Login
                  </>
                ) : (
                  <>
                    <UserPlus size={18} /> Sign Up
                  </>
                )}
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-center w-full">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-health-primary hover:text-health-secondary font-medium"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

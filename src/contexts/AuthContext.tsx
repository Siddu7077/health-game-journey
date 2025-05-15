
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
  age: number | string;
  gender: string;
  role: 'user' | 'admin';
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  age: string | number;
  gender: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupFormData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('healthgames_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('healthgames_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation for demo purposes
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        email,
        age: 30,
        gender: 'prefer-not-to-say',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('healthgames_user', JSON.stringify(adminUser));
    } else if (email && password) {
      // For demo purposes, any other email/password combo works
      const newUser: User = {
        id: 'user-' + Math.floor(Math.random() * 1000),
        name: email.split('@')[0],
        email,
        age: 25,
        gender: 'prefer-not-to-say',
        role: 'user'
      };
      setUser(newUser);
      localStorage.setItem('healthgames_user', JSON.stringify(newUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const signup = async (data: SignupFormData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new user
    const newUser: User = {
      id: 'user-' + Math.floor(Math.random() * 1000),
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      role: 'user'
    };
    
    setUser(newUser);
    localStorage.setItem('healthgames_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('healthgames_user');
    
    toast({
      description: "Logged out successfully",
    });
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAdmin: user?.role === 'admin', 
        login, 
        signup, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

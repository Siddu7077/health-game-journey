
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, User, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // Animation on component mount
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-bounce-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero section */}
      <section className="relative text-center py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-health-light to-white -z-10"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-health-dark sm:text-5xl md:text-6xl">
            <span className="block">Health Games</span>
            <span className="block text-health-primary mt-2">Interactive Therapeutic Experiences</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
            Chat with our AI health assistant about your symptoms, play therapeutic games, and track your progress over time.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link to="/chat">
              <Button className="bg-health-primary hover:bg-health-secondary text-white flex items-center gap-2">
                <MessageCircle size={18} />
                Start Chat
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="outline" className="border-health-primary text-health-primary hover:bg-health-light flex items-center gap-2">
                <Play size={18} />
                Play Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-health-dark">How It Works</h2>
          <p className="mt-2 text-gray-500">Three simple steps to better health through interactive experiences</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="animate-on-scroll">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-health-light p-4 rounded-full mb-4">
                    <MessageCircle size={24} className="text-health-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Chat About Your Health</h3>
                  <p className="text-gray-500">
                    Describe your symptoms to our AI assistant for personalized health suggestions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-on-scroll" style={{animationDelay: '0.2s'}}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-health-light p-4 rounded-full mb-4">
                    <Play size={24} className="text-health-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Play Therapeutic Games</h3>
                  <p className="text-gray-500">
                    Engage with specialized games designed to help with specific health conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="animate-on-scroll" style={{animationDelay: '0.4s'}}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-health-light p-4 rounded-full mb-4">
                    <User size={24} className="text-health-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                  <p className="text-gray-500">
                    Monitor improvements over time with detailed usage statistics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-health-light rounded-lg text-center">
        <h2 className="text-2xl font-bold text-health-dark mb-4">Ready to start your health journey?</h2>
        <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
          Create an account to save your progress and get personalized recommendations based on your health profile.
        </p>
        <Link to={user ? "/chat" : "/auth"}>
          <Button className="bg-health-primary hover:bg-health-secondary text-white flex items-center gap-2">
            {user ? (
              <>
                <MessageCircle size={18} />
                Continue to Chat
              </>
            ) : (
              <>
                <User size={18} />
                Create Account
              </>
            )}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </section>

      {/* Testimonials section - could be implemented in v2 */}
    </div>
  );
};

export default Home;

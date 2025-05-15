
import { Link } from 'react-router-dom';

const AppFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-health-primary rounded-full w-7 h-7 flex items-center justify-center">
                <span className="text-white font-bold text-md">H</span>
              </div>
              <span className="font-bold text-lg text-health-dark">HealthGames</span>
            </Link>
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-500 md:mt-0">
            © {year} HealthGames. All rights reserved.
          </p>
          
          <div className="mt-4 flex justify-center md:mt-0">
            <div className="flex space-x-6">
              <Link to="/about" className="text-sm text-gray-500 hover:text-health-primary">
                About
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-health-primary">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-health-primary">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-health-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

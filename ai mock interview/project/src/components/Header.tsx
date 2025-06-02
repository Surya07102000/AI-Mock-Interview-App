import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  
  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const headerClass = isHomePage 
    ? `transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`
    : 'bg-white shadow-md py-3';
    
  const linkClass = isHomePage && !isScrolled
    ? 'text-white hover:text-blue-200'
    : 'text-gray-700 hover:text-indigo-900';
    
  const logoDark = 'text-indigo-900 font-bold text-xl';
  const logoLight = 'text-white font-bold text-xl';
  
  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className={isHomePage && !isScrolled ? logoLight : logoDark}>
            InterviewAI
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${linkClass} font-medium`}>
              Home
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className={`${linkClass} font-medium`}>
                  Dashboard
                </Link>
                <Link to="/history" className={`${linkClass} font-medium`}>
                  History
                </Link>
                <Link to="/profile" className={`${linkClass} font-medium`}>
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="bg-transparent border border-indigo-900 text-indigo-900 hover:bg-indigo-900 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={`${linkClass} font-medium`}>
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-indigo-900 text-white hover:bg-indigo-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className={isHomePage && !isScrolled ? "text-white" : "text-gray-800"} />
            ) : (
              <Menu className={isHomePage && !isScrolled ? "text-white" : "text-gray-800"} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <nav className="flex flex-col p-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-900 py-2 px-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-indigo-900 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/history" 
                  className="text-gray-700 hover:text-indigo-900 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-indigo-900 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-700 hover:text-indigo-900 py-2 px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-indigo-900 py-2 px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-900 text-white hover:bg-indigo-800 py-2 px-4 my-2 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
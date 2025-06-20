import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navbar - Hidden on mobile */}
      <nav className="hidden lg:block absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-6">
        <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10">
          <div className="flex justify-between items-center h-16 px-8">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-white text-xl lg:text-2xl font-bold hover:text-gray-200 transition-colors">
                StayFinder
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-white hover:text-gray-300 text-base font-normal transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/listings" 
                className="text-white hover:text-gray-300 text-base font-normal transition-colors"
              >
                Hotels
              </Link>
              <button 
                onClick={() => navigate('/listings')}
                className="text-white hover:text-gray-300 text-base font-normal transition-colors"
              >
                Destinations
              </button>
              <button 
                onClick={() => navigate('/listings')}
                className="text-white hover:text-gray-300 text-base font-normal transition-colors"
              >
                Deals
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => navigate('/listings')}
                    className="text-white border border-white/40 hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    My Bookings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="text-white border border-white/40 hover:bg-white/10 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
        {/* App Name */}
        <Link to="/" className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
          StayFinder
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="bg-black/20 backdrop-blur-md rounded-full p-3 border border-white/10 text-white hover:bg-black/30 transition-all duration-200"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay - Only visible when open */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
                     <div className="absolute top-20 left-6 right-6 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">

            {/* Navigation Links */}
            <Link 
              to="/" 
              className="block text-white hover:text-gray-200 text-lg font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/>
                </svg>
                Home
              </div>
            </Link>
            <Link 
              to="/listings" 
              className="block text-white hover:text-gray-200 text-lg font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V6H1v15h2v-3h18v3h2V7h-4z"/>
                </svg>
                Hotels
              </div>
            </Link>
            <button 
              onClick={() => {
                navigate('/listings');
                toggleMobileMenu();
              }}
              className="block text-white hover:text-gray-200 text-lg font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-left w-full"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Destinations
              </div>
            </button>
            <button 
              onClick={() => {
                navigate('/listings');
                toggleMobileMenu();
              }}
              className="block text-white hover:text-gray-200 text-lg font-medium transition-colors py-3 px-4 rounded-lg hover:bg-white/10 text-left w-full"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Deals
              </div>
            </button>
            
            <hr className="border-white/20 my-4" />
            
            {/* Auth Actions */}
            {isLoggedIn ? (
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    navigate('/listings');
                    toggleMobileMenu();
                  }}
                  className="block w-full text-white border border-white/40 hover:bg-white/10 text-center py-3 px-4 rounded-lg transition-all"
                >
                  My Bookings
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-3 px-4 rounded-lg font-semibold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login"
                  className="block text-white border border-white/40 hover:bg-white/10 text-center py-3 px-4 rounded-lg transition-all"
                  onClick={toggleMobileMenu}
                >
                  Log in
                </Link>
                <Link 
                  to="/register"
                  className="block bg-yellow-500 hover:bg-yellow-600 text-black text-center py-3 px-4 rounded-lg font-semibold transition-all"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 
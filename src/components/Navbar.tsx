import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold hover:text-blue-100 transition-colors">
              StayFinder
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
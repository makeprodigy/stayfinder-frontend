import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800">
            Find Your Perfect Stay
          </h1>
          <h2 className="text-xl md:text-2xl mb-8 text-gray-600 max-w-2xl mx-auto text-center">
            Discover amazing places to stay around the world. From cozy apartments to luxury villas.
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              onClick={() => navigate('/listings')}
            >
              Explore Listings
            </button>
            <button
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              🏠 Unique Properties
            </h3>
            <p className="text-gray-600">
              Choose from a wide variety of unique accommodations
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              🌍 Global Reach
            </h3>
            <p className="text-gray-600">
              Find stays in destinations around the world
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              💫 Great Experience
            </h3>
            <p className="text-gray-600">
              Enjoy seamless booking and amazing host experiences
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 
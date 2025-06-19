import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Typography variant="h2" component="h1" className="mb-6 text-gray-800 font-bold">
            Find Your Perfect Stay
          </Typography>
          <Typography variant="h5" className="mb-8 text-gray-600 max-w-2xl mx-auto">
            Discover amazing places to stay around the world. From cozy apartments to luxury villas.
          </Typography>
          <Box className="flex gap-4 justify-center flex-wrap">
            <Button
              variant="contained"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
              onClick={() => navigate('/listings')}
            >
              Explore Listings
            </Button>
            <Button
              variant="outlined"
              size="large"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Box>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Typography variant="h6" className="mb-2 text-gray-800">
              🏠 Unique Properties
            </Typography>
            <Typography className="text-gray-600">
              Choose from a wide variety of unique accommodations
            </Typography>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Typography variant="h6" className="mb-2 text-gray-800">
              🌍 Global Reach
            </Typography>
            <Typography className="text-gray-600">
              Find stays in destinations around the world
            </Typography>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Typography variant="h6" className="mb-2 text-gray-800">
              💫 Great Experience
            </Typography>
            <Typography className="text-gray-600">
              Enjoy seamless booking and amazing host experiences
            </Typography>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Home; 
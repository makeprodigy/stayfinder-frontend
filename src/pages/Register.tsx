import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { RegisterData, AuthResponse } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Hero Image (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
          alt="Travel adventure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Bottom overlay text */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <Typography variant="h5" className="text-white font-bold mb-2 uppercase tracking-wide">
              Join thousands of travelers discovering amazing places around the world. Your next adventure awaits!
            </Typography>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8 overflow-y-auto relative 
                      bg-cover bg-center bg-no-repeat lg:bg-none lg:bg-white
                      before:absolute before:inset-0 before:bg-cover before:bg-center before:bg-no-repeat before:content-[''] 
                      before:bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop')]
                      lg:before:hidden">
        <div className="w-full max-w-md bg-white/20 lg:bg-white backdrop-blur-xl lg:backdrop-blur-none rounded-xl lg:rounded-none shadow-2xl lg:shadow-none border border-white/30 lg:border-none relative z-10">
          <motion.div
            className="w-full p-6 lg:p-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 sm:mb-6">
              <Typography variant="h5" className="font-bold text-white lg:text-gray-900 mb-1 uppercase tracking-wider text-xl sm:text-2xl lg:text-3xl drop-shadow-lg lg:drop-shadow-none">
                Start Your Journey
              </Typography>
              <Typography variant="h5" className="font-bold text-white lg:text-gray-900 mb-3 uppercase tracking-wider text-xl sm:text-2xl lg:text-3xl drop-shadow-lg lg:drop-shadow-none">
                Create Account
              </Typography>
              <Typography className="text-white lg:text-gray-600 text-sm sm:text-base leading-relaxed drop-shadow-md lg:drop-shadow-none">
                Join our community of travelers and discover unique stays around the world. Sign up to unlock exclusive deals!
              </Typography>
            </div>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <Typography className="text-white lg:text-gray-700 mb-0.5 font-medium text-xs drop-shadow-md lg:drop-shadow-none">Full Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter your full name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                className="bg-amber-50"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }
                }}
              />
            </div>

            <div>
              <Typography className="text-white lg:text-gray-700 mb-0.5 font-medium text-xs drop-shadow-md lg:drop-shadow-none">Email</Typography>
              <TextField
                fullWidth
                placeholder="Input email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                className="bg-amber-50"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }
                }}
              />
            </div>
            
            <div>
              <Typography className="text-white lg:text-gray-700 mb-0.5 font-medium text-xs drop-shadow-md lg:drop-shadow-none">Password</Typography>
              <TextField
                fullWidth
                placeholder="••••••••"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                className="bg-amber-50"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fffbeb',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }
                }}
              />
            </div>

            <div className="flex items-center mt-2">
              <input type="checkbox" className="mr-2 scale-75" required />
              <Typography className="text-white lg:text-gray-600 text-xs leading-tight drop-shadow-md lg:drop-shadow-none">
                I agree to the{' '}
                <span className="text-blue-300 lg:text-blue-600 cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-blue-300 lg:text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
              </Typography>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="small"
              disabled={loading}
              className="bg-gray-900 hover:bg-black text-white font-semibold py-1.5 rounded-lg mt-3"
              sx={{ 
                backgroundColor: '#111827',
                '&:hover': { backgroundColor: '#000000' },
                textTransform: 'none',
                fontSize: '14px',
                minHeight: '36px'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account - Start Exploring'}
            </Button>
          </form>

          <div className="mt-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white/20 lg:bg-white text-white lg:text-gray-500 backdrop-blur-sm lg:backdrop-blur-none rounded lg:rounded-none">Or sign up with</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <button className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                <span className="mr-2 text-base">🔍</span>
                Sign up with Google
              </button>
              <button className="w-full flex justify-center items-center px-4 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm">
                <span className="mr-2 text-base">🍎</span>
                Sign up with Apple
              </button>
              <button className="w-full flex justify-center items-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                <span className="mr-2 text-base">📘</span>
                Sign up with Facebook
              </button>
            </div>
          </div>

          <div className="mt-3 text-center">
            <Typography className="text-white lg:text-gray-600 text-xs drop-shadow-md lg:drop-shadow-none">
              Already have an account?{' '}
              <Link to="/login" className="text-white lg:text-gray-900 font-semibold hover:underline">
                Sign In
              </Link>
            </Typography>
                      </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
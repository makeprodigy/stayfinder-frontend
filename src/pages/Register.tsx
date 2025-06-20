import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      navigate('/'); // Go to home if no history
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
        
                 {/* Back Button for Desktop */}
         <div className="absolute top-6 left-6">
           <button
             onClick={handleBack}
             className="flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-10 h-10 rounded-xl font-medium transition-all duration-200 group"
             title="Back"
           >
             <svg 
               className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
         </div>
        
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
        
                 {/* Back Button for Mobile */}
         <div className="absolute top-6 left-6 lg:hidden z-20">
           <button
             onClick={handleBack}
             className="flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white w-10 h-10 rounded-xl font-medium transition-all duration-200 group"
             title="Back"
           >
             <svg 
               className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
             </svg>
           </button>
         </div>

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
                <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
              <button className="w-full flex justify-center items-center px-4 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm">
                <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Sign up with Apple
              </button>
              <button className="w-full flex justify-center items-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
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
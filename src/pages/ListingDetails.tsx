import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';
import { Listing } from '../types';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await apiClient.get<Listing>(`/listings/${id}`);
        setListing(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="info">Listing not found</Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100">
      <Container maxWidth="lg" className="pt-32 pb-8 lg:h-screen lg:overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={3} className="p-8 mb-8">
            <Typography variant="h3" component="h1" className="mb-4 font-bold">
              {listing.title}
            </Typography>
            
            <Typography variant="h6" className="mb-6 text-gray-600">
              📍 {listing.location}
            </Typography>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
              {/* Left Side - Image */}
              <motion.div 
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 sticky top-4">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300.png?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>

              {/* Middle - Content */}
              <div className="lg:col-span-4">
                {/* Enhanced Description Section */}
                <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                  {listing.description}
                </Typography>
                
                {/* Additional Details */}
                <Box className="mb-6">
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6 text-sm">
                    <li>Prime location near attractions</li>
                    <li>24/7 professional support</li>
                    <li>Modern amenities & comfort</li>
                    <li>Business & leisure friendly</li>
                    <li>High-speed WiFi throughout</li>
                    <li>Local recommendations included</li>
                  </ul>
                  
                  {/* Amenities without heading */}
                  <Box className="flex flex-wrap gap-2">
                    {listing.amenities?.map((amenity, index) => (
                      <Chip key={index} label={amenity} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </div>

              {/* Right Side - Pricing */}
              <div className="lg:col-span-3">
                <Paper elevation={2} className="p-4 bg-blue-50 h-64 md:h-80 flex flex-col justify-between sticky top-4">
                  <div>
                    <Typography variant="h4" className="mb-3 text-blue-600 font-bold">
                      ₹{listing.price}/night
                    </Typography>
                    
                    <Box className="space-y-1 mb-4">
                      <Typography className="text-sm">👥 Max Guests: {listing.maxGuests}</Typography>
                      <Typography className="text-sm">🛏️ Bedrooms: {listing.bedrooms}</Typography>
                      <Typography className="text-sm">🚿 Bathrooms: {listing.bathrooms}</Typography>
                    </Box>
                  </div>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book Now
                  </Button>
                </Paper>
              </div>
            </div>

            <Box className="border-t pt-6">
              <Typography variant="h6" className="mb-2">
                Hosted by {listing.host.name}
              </Typography>
              <Typography className="text-gray-600">
                Member since {new Date(listing.host.createdAt).getFullYear()}
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </div>
  );
};

export default ListingDetails; 
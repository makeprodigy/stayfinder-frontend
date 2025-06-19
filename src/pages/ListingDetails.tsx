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
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={3} className="p-8 mb-8">
            <Typography variant="h3" component="h1" className="mb-4 font-bold">
              {listing.title}
            </Typography>
            
            <Typography variant="h6" className="mb-4 text-gray-600">
              📍 {listing.location}
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <Typography variant="body1" className="mb-4 text-gray-700 leading-relaxed">
                  {listing.description}
                </Typography>
                
                <Box className="mb-4">
                  <Typography variant="h6" className="mb-2">
                    Amenities
                  </Typography>
                  <Box className="flex flex-wrap gap-2">
                    {listing.amenities?.map((amenity, index) => (
                      <Chip key={index} label={amenity} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </div>
              
              <div className="md:col-span-1">
                <Paper elevation={2} className="p-6 bg-blue-50">
                  <Typography variant="h4" className="mb-4 text-blue-600 font-bold">
                    ${listing.price}/night
                  </Typography>
                  
                  <Box className="mb-4 space-y-2">
                    <Typography>👥 Max Guests: {listing.maxGuests}</Typography>
                    <Typography>🛏️ Bedrooms: {listing.bedrooms}</Typography>
                    <Typography>🚿 Bathrooms: {listing.bathrooms}</Typography>
                  </Box>
                  
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
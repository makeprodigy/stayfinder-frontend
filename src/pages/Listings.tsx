import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Box,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { Listing } from '../types';

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await apiClient.get<Listing[]>('/listings');
        setListings(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" className="font-bold mb-8 text-center text-gray-800">
          Explore Our Listings
        </Typography>
        <Grid container spacing={4}>
          {listings.map((listing) => (
            <Grid item key={listing._id} xs={12} sm={6} md={4}>
              <Card
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={listing.images[0] || 'https://via.placeholder.com/400x250.png?text=No+Image'}
                  alt={listing.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    {listing.location}
                  </Typography>
                  <Typography variant="h5" color="primary" className="font-bold">
                    ${listing.price}
                    <span className="text-base font-normal text-gray-600">/night</span>
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/listing/${listing._id}`}
                    fullWidth
                    variant="contained"
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Listings; 
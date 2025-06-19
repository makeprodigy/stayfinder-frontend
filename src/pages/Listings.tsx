import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
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
      <div className="flex justify-center items-center min-h-[80vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          Explore Our Listings
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <article 
              key={listing._id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 flex flex-col h-full"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.images[0] || 'https://via.placeholder.com/400x250.png?text=No+Image'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">
                  {listing.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3">
                  📍 {listing.location}
                </p>
                <div className="mt-auto">
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ${listing.price}
                    <span className="text-base font-normal text-gray-600">/night</span>
                  </p>
                  <Link
                    to={`/listing/${listing._id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Listings; 
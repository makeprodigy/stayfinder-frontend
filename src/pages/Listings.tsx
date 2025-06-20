import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import apiClient from '../api/axios';
import { Listing } from '../types';

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const location = useLocation();
  const filterFromState = location.state?.filter;

  // Get unique locations from listings
  const uniqueLocations = ['All Locations', ...Array.from(new Set(listings.map(listing => listing.location)))];

  const toggleFavorite = (listingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await apiClient.get<Listing[]>('/listings');
        setListings(response.data);
        setFilteredListings(response.data);
        
        // If there's a filter from navigation state, apply it
        if (filterFromState) {
          setLocationFilter(filterFromState);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filterFromState]);

  // Filter listings based on search and location
  useEffect(() => {
    let filtered = listings;

    // Apply location filter
    if (locationFilter !== 'All Locations') {
      filtered = filtered.filter(listing => 
        listing.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Apply search filter
    if (searchFilter) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchFilter, locationFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-amber-100">
        <div className="text-center">
          <CircularProgress size={60} />
          <p className="mt-4 text-gray-600">Loading amazing stays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-100 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="mb-8">{error}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-100 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Discover Amazing Stays
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From cozy city apartments to luxury mountain retreats across India
          </p>
        </div>

        {/* Search Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="flex-1 w-full">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-gray-700 shadow-sm"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="w-full md:w-auto">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">🌍</span>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full md:w-64 pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white appearance-none text-gray-700 shadow-sm"
              >
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 text-sm whitespace-nowrap">
            {filteredListings.length} properties found
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters or browse all locations</p>
            <button
              onClick={() => {
                setSearchFilter('');
                setLocationFilter('All Locations');
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <Link
                key={listing._id}
                to={`/listing/${listing._id}`}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="relative overflow-hidden">
                    <img
                      src={listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                      alt={listing.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                      📍 {listing.location}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(listing._id);
                      }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 cursor-pointer hover:scale-110"
                    >
                      <svg 
                        className={`w-5 h-5 transition-colors duration-200 ${
                          favorites.has(listing._id) ? 'text-red-500 fill-red-500' : 'text-gray-400 fill-none'
                        }`}
                        fill="currentFill"
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                      {listing.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{listing.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-500 mb-1">
                          <span className="text-sm">★</span>
                          <span className="text-sm font-medium ml-1">4.8</span>
                        </div>
                        <p className="text-xs text-gray-500">125 reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings; 
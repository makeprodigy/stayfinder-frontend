import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Listing } from '../types';
import CustomDropdown from '../components/CustomDropdown';

// Define price ranges for the dropdown outside component to avoid dependency issues
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000 - ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: Infinity }
];

const Listings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [priceFilter, setPriceFilter] = useState('All Prices');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const location = useLocation();
  const filterFromState = location.state?.filter;
  const navigate = useNavigate();

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

  // Filter listings based on search, location, and price
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

    // Apply price filter
    if (priceFilter !== 'All Prices') {
      const selectedRange = priceRanges.find(range => range.label === priceFilter);
      if (selectedRange) {
        filtered = filtered.filter(listing =>
          listing.price >= selectedRange.min && listing.price <= selectedRange.max
        );
      }
    }

    setFilteredListings(filtered);
  }, [listings, searchFilter, locationFilter, priceFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <CircularProgress size={60} />
          <p className="mt-4 text-gray-600">Loading amazing stays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert severity="error" className="mb-8">{error}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 w-12 h-12 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
            title="Back to Home"
          >
            <svg 
              className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

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
        <div className="mb-12 max-w-6xl mx-auto">
          {/* Search Input Row */}
          <div className="mb-6">
            <div className="relative group">
              <div className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400">
                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search hotels, locations, or amenities..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-sm sm:text-base text-gray-700 placeholder-gray-400"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Left Side - Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Location Filter */}
              <div className="w-full sm:w-auto">
                <CustomDropdown
                  options={uniqueLocations.map(location => ({ value: location, label: location }))}
                  value={locationFilter}
                  onChange={(value) => setLocationFilter(value)}
                  placeholder="All Locations"
                  focusColor="blue"
                  className="w-full sm:w-52 lg:w-60"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                />
              </div>

              {/* Price Range Filter */}
              <div className="w-full sm:w-auto">
                <CustomDropdown
                  options={priceRanges.map(range => ({ value: range.label, label: range.label }))}
                  value={priceFilter}
                  onChange={(value) => setPriceFilter(value)}
                  placeholder="All Prices"
                  focusColor="green"
                  className="w-full sm:w-52 lg:w-60"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Clear All Filters Button */}
              {(searchFilter || locationFilter !== 'All Locations' || priceFilter !== 'All Prices') && (
                <button
                  onClick={() => {
                    setSearchFilter('');
                    setLocationFilter('All Locations');
                    setPriceFilter('All Prices');
                  }}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  title="Clear All Filters"
                >
                  <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

              {/* Results Count */}
              <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 flex-shrink-0">
                <div className="text-yellow-500">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-gray-700 text-sm sm:text-base font-medium whitespace-nowrap">
                  {filteredListings.length} properties
                </div>
              </div>
            </div>
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
                setPriceFilter('All Prices');
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
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-900 flex items-center gap-1.5 shadow-lg border border-white/20">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-gray-700">{listing.location}</span>
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
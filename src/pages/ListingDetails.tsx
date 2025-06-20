import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api/axios';
import { Listing } from '../types';
import CustomDropdown from '../components/CustomDropdown';

const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!listing || !checkIn || !checkOut) return 0;
    const nights = calculateNights();
    return nights * listing.price;
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!checkIn || !checkOut || !listing) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (guests > listing.maxGuests) {
      setError(`Maximum guests allowed: ${listing.maxGuests}`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      const bookingData = {
        listing: listing._id,
        startDate: checkIn.toISOString(),
        endDate: checkOut.toISOString(),
        guests,
        totalPrice: calculateTotalPrice()
      };

      await apiClient.post('/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowBookingModal(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

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
    <div className="min-h-screen">
      <Container maxWidth="lg" className="pt-32 pb-8 lg:h-screen lg:overflow-y-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate('/listings')}
            className="flex items-center justify-center bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 w-12 h-12 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
            title="Back to Listings"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="mb-6">
              <Typography variant="h3" component="h1" className="mb-3 font-bold text-gray-800 leading-tight">
                {listing.title}
              </Typography>
              
              <div className="flex items-center text-gray-600 mb-4">
                <div className="flex items-center bg-red-50 px-3 py-1.5 rounded-full">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium text-red-700">{listing.location}</span>
                </div>
              </div>
              
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-bold text-yellow-700 mr-2">4.8</span>
                  <span className="text-yellow-600 text-sm">(125 reviews)</span>
                </div>
                <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-full">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-700 font-medium text-sm">Instant Book</span>
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6">
              {/* Left Side - Image */}
              <motion.div 
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 sticky top-4 group">
                  <img
                    src={listing.images?.[0] || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300.png?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                  
                  {/* Photo overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View Photos
                  </div>
                </div>
              </motion.div>

              {/* Middle - Content */}
              <div className="lg:col-span-4">
                {/* Enhanced Description Section */}
                <div className="mb-6">
                  <Typography variant="body1" className="mb-6 text-gray-700 leading-relaxed text-base">
                    {listing.description}
                  </Typography>
                </div>
                
                {/* What this place offers */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    What this place offers
                  </h3>
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>Prime location near attractions</span>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12l6.8-6.8" />
                      </svg>
                      <span>24/7 professional support</span>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                      <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span>Modern amenities & comfort</span>
                    </div>
                    <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                      <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      <span>High-speed WiFi throughout</span>
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities?.map((amenity, index) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Booking Form */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100 rounded-2xl shadow-xl p-6 sticky top-4 hover:shadow-2xl transition-all duration-300">
                  {/* Price Display */}
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h4" className="text-blue-600 font-bold">
                      ₹{listing.price.toLocaleString('en-IN')}
                    </Typography>
                    <span className="text-blue-500 text-sm font-medium bg-blue-100 px-2 py-1 rounded-full">
                      /night
                    </span>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4 mb-6">
                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check In</label>
                        <DatePicker
                          selected={checkIn}
                          onChange={(date: Date | null) => setCheckIn(date)}
                          selectsStart
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={new Date()}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholderText="Select date"
                          dateFormat="MMM dd"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
                        <DatePicker
                          selected={checkOut}
                          onChange={(date: Date | null) => setCheckOut(date)}
                          selectsEnd
                          startDate={checkIn}
                          endDate={checkOut}
                          minDate={checkIn || new Date()}
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholderText="Select date"
                          dateFormat="MMM dd"
                        />
                      </div>
                    </div>

                    {/* Guest Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                      <CustomDropdown
                        options={Array.from({ length: listing.maxGuests }, (_, i) => ({
                          value: (i + 1).toString(),
                          label: `${i + 1} ${i + 1 === 1 ? 'guest' : 'guests'}`
                        }))}
                        value={guests.toString()}
                        onChange={(value) => setGuests(Number(value))}
                        placeholder="Select guests"
                        focusColor="blue"
                        className="text-sm"
                      />
                    </div>

                    {/* Price Breakdown */}
                    {checkIn && checkOut && (
                      <div className="bg-white/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>₹{listing.price.toLocaleString('en-IN')} × {calculateNights()} nights</span>
                          <span>₹{(listing.price * calculateNights()).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="font-medium">Max Guests: {listing.maxGuests}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                      <span className="font-medium">Bedrooms: {listing.bedrooms}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      <span className="font-medium">Bathrooms: {listing.bathrooms}</span>
                    </div>
                  </div>
                  
                  {/* Book Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBooking}
                    disabled={!checkIn || !checkOut || bookingLoading}
                    className={`font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      !checkIn || !checkOut || bookingLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    }`}
                  >
                    {bookingLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : !checkIn || !checkOut ? (
                      'Select Dates'
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        BOOK NOW
                      </>
                    )}
                  </Button>

                  {error && (
                    <Alert severity="error" className="mt-4">
                      {error}
                    </Alert>
                  )}
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  {listing.host.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <Typography variant="h6" className="text-gray-800 font-semibold text-base sm:text-lg">
                      Hosted by {listing.host.name}
                    </Typography>
                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium inline-block self-center sm:self-auto">
                      Superhost
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm gap-1 sm:gap-0">
                    <div className="flex items-center justify-center sm:justify-start">
                      <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Member since {new Date(listing.host.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                    <div className="flex items-center justify-center sm:justify-start text-yellow-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="font-medium">4.9 rating</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Responds within an hour</span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <Button
                    variant="outlined"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 px-4 sm:px-6 py-2 rounded-xl font-medium w-full sm:w-auto text-sm sm:text-base"
                  >
                    Contact Host
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Booking Confirmation Modal */}
      <Dialog 
        open={showBookingModal} 
        onClose={() => setShowBookingModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h5" className="font-bold text-gray-900">
              Booking Confirmed!
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="text-center space-y-4">
            <Typography className="text-gray-600">
              Your booking has been successfully confirmed. You will receive a confirmation email shortly.
            </Typography>
            
            {checkIn && checkOut && listing && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Property:</span>
                  <span>{listing.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-in:</span>
                  <span>{checkIn.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Check-out:</span>
                  <span>{checkOut.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{calculateTotalPrice().toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions className="flex justify-center space-x-4 pb-6">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            View My Bookings
          </Button>
          <Button
            onClick={() => {
              setShowBookingModal(false);
              navigate('/listings');
            }}
            variant="outlined"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg"
          >
            Continue Browsing
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListingDetails; 
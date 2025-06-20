import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from '../api/axios';
import { Listing } from '../types';
import CustomDropdown from '../components/CustomDropdown';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('2 Guest, 1 Room');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await apiClient.get<Listing[]>('/listings');
        setListings(response.data);
      } catch (err) {
        console.error('Failed to load listings');
      }
    };
    fetchListings();
  }, []);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const handleSearch = () => {
    navigate('/listings', { 
      state: { 
        filter: location,
        guests: guests,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString()
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[500px] h-[600px] sm:min-h-[600px] sm:h-[700px] md:min-h-[650px] md:h-[750px] lg:h-[75vh] xl:h-[80vh] bg-cover bg-center bg-no-repeat overflow-hidden rounded-b-2xl sm:rounded-b-3xl"
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop")'
           }}>
        
        {/* Main Content - Side by Side Layout */}
        <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 z-30 pt-12 sm:pt-14 md:pt-16 lg:pt-0 pb-8 sm:pb-10 md:pb-12 lg:pb-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 min-h-0">
          {/* Left Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl text-center lg:text-left flex flex-col justify-center items-center lg:items-start order-1 lg:order-1"
          >
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight mb-2 sm:mb-3 md:mb-4 lg:mb-6">
              Perfect Stay<br />
              Every Time.
            </h1>
            <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0 font-medium px-2 sm:px-0" 
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Explore handpicked hotels with seamless booking, exclusive offers, and unmatched hospitality
            </p>
            <button 
              onClick={() => navigate('/listings')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base lg:text-lg transition-all duration-200 hover:scale-105 flex items-center mx-auto lg:mx-0"
            >
              Explore Hotels
              <span className="ml-2">→</span>
            </button>
          </motion.div>

          {/* Right Side - Search Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex-1 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl order-2 lg:order-2"
          >
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 lg:p-6">
              {/* Search Inputs */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Location</label>
                  <div className="relative">
                    <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Find Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Guest and Rooms</label>
                  <CustomDropdown
                    options={[
                      { value: '1 Guest, 1 Room', label: '1 Guest, 1 Room' },
                      { value: '2 Guest, 1 Room', label: '2 Guest, 1 Room' },
                      { value: '3 Guest, 1 Room', label: '3 Guest, 1 Room' },
                      { value: '4 Guest, 2 Rooms', label: '4 Guest, 2 Rooms' },
                      { value: '5 Guest, 2 Rooms', label: '5 Guest, 2 Rooms' },
                      { value: '6 Guest, 3 Rooms', label: '6 Guest, 3 Rooms' }
                    ]}
                    value={guests}
                    onChange={(value) => setGuests(value)}
                    placeholder="Select guests"
                    focusColor="yellow"
                    className="text-sm sm:text-base"
                    icon={
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10l-1-1 .4-2.2A1.5 1.5 0 0 0 12 5.5h-2A1.5 1.5 0 0 0 8.5 7v6L6 15.5V22h2v-5l2-1.5V22h8zM12.5 11.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-6-7c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2z"/>
                      </svg>
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Check In- Check Out Date</label>
                  <div className="relative date-picker-container">
                    <svg className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    <div 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm sm:text-base text-gray-700 placeholder-gray-400 cursor-pointer bg-white flex items-center"
                    >
                      {checkIn && checkOut ? 
                        `${checkIn.toLocaleDateString()} - ${checkOut.toLocaleDateString()}` : 
                        'Add Date'
                      }
                    </div>
                    {showDatePicker && (
                      <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check In</label>
                          <DatePicker
                            selected={checkIn}
                            onChange={(date: Date | null) => setCheckIn(date)}
                            selectsStart
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={new Date()}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholderText="Select check-in date"
                            dateFormat="MMM dd, yyyy"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Check Out</label>
                          <DatePicker
                            selected={checkOut}
                            onChange={(date: Date | null) => setCheckOut(date)}
                            selectsEnd
                            startDate={checkIn}
                            endDate={checkOut}
                            minDate={checkIn || new Date()}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholderText="Select check-out date"
                            dateFormat="MMM dd, yyyy"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCheckIn(null);
                              setCheckOut(null);
                            }}
                            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => setShowDatePicker(false)}
                            className="flex-1 px-3 py-2 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                >
                  Search Now
                  <span className="ml-2">→</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats and Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 lg:py-20 px-4 lg:px-16 bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Discover stays tailored to your dreams.
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Luxury, comfort, or adventure – your journey begins here.
              </p>
              <button 
                onClick={() => navigate('/listings')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-flex items-center">
                Get Started
                <span className="ml-2">→</span>
              </button>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{listings.length * 16}+</div>
                  <div className="text-gray-600">Hotels Listed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 rounded-2xl p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Now</h3>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">and Unwind</h3>
                <h3 className="text-2xl font-bold text-gray-900">in Style!</h3>
              </div>
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop" 
                  alt="Luxury Room" 
                  className="w-full h-32 object-cover rounded-2xl"
                />
                <img 
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop" 
                  alt="Hotel View" 
                  className="w-full h-32 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rooms Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16 lg:py-20 px-4 lg:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Rooms That Feel Like Home
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comfort, style, and all the essentials—just like home, only better.
            </p>
          </div>

          {/* Featured Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.slice(0, 6).map((listing) => (
              <div key={listing._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer" onClick={() => navigate(`/listing/${listing._id}`)}>
                <div className="relative overflow-hidden">
                  <img
                    src={listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{listing.price.toLocaleString('en-IN')}</span>
                      <span className="text-gray-600 text-sm ml-1">/night</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-orange-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="font-semibold text-gray-900">4.8</span>
                      <span className="text-gray-500 text-sm ml-1">({Math.floor(Math.random() * 500 + 100)} Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/listings')}
              className="bg-gray-900 hover:bg-black text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View All Properties
            </button>
          </div>
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="py-16 px-4 lg:px-16 bg-white shadow-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-8 lg:p-12">
                <div className="text-white/80 text-sm mb-2">Ready to Travel?</div>
                <h3 className="text-white text-3xl lg:text-4xl font-bold mb-6">
                  Your Dream Getaway<br />
                  Awaits – Don't Wait!
                </h3>
                <p className="text-white/90 mb-8">
                  Ready to escape and create unforgettable memories? Book your stay now and experience luxury, comfort, and breathtaking views.
                </p>
                <button 
                  onClick={() => navigate('/listings')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105 inline-flex items-center"
                >
                  Book Your Stay
                  <span className="ml-2">→</span>
                </button>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop" 
                  alt="Luxury Hotel" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home; 
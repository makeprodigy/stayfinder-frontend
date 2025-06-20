import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { Listing } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('2 Guest, 1 Room');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

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

  const handleSearch = () => {
    navigate('/listings', { 
      state: { 
        filter: location,
        guests: guests,
        checkIn: checkIn,
        checkOut: checkOut
      }
    });
  };

  const roomTypes = ['Standard Rooms', 'Deluxe Rooms', 'Family Rooms', 'Business Rooms', 'Luxury Suites'];
  const [activeRoomType, setActiveRoomType] = useState('Standard Rooms');

  return (
    <div className="min-h-screen bg-amber-100">
      {/* Hero Section */}
      <div className="relative h-[92vh] bg-cover bg-center bg-no-repeat overflow-hidden rounded-b-3xl"
           style={{
             backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop")'
           }}>
        


        {/* Main Content - Side by Side Layout */}
        <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center px-4 sm:px-8 lg:px-16 z-30 pt-20 lg:pt-0 gap-8 lg:gap-16">
          {/* Left Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex-1 max-w-full lg:max-w-2xl text-center lg:text-left"
          >
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-3 sm:mb-4 lg:mb-6">
              Perfect Stay<br />
              Every Time.
            </h1>
            <p className="text-white text-sm sm:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-full lg:max-w-lg mx-auto lg:mx-0 font-medium" 
               style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
              Explore handpicked hotels with seamless booking, exclusive offers, and unmatched hospitality
            </p>
            <button 
              onClick={() => navigate('/listings')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transition-all duration-200 hover:scale-105 flex items-center mx-auto lg:mx-0"
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
            className="flex-1 w-full max-w-full lg:max-w-lg"
          >
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-6">
              {/* Search Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">📍</span>
                    <input
                      type="text"
                      placeholder="Find Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guest and Rooms</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">👥</span>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent appearance-none bg-white text-gray-700"
                    >
                      <option>1 Guest, 1 Room</option>
                      <option>2 Guest, 1 Room</option>
                      <option>3 Guest, 1 Room</option>
                      <option>4 Guest, 2 Rooms</option>
                      <option>5 Guest, 2 Rooms</option>
                      <option>6 Guest, 3 Rooms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Check In- Check Out Date</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500">📅</span>
                    <input
                      type="text"
                      placeholder="Add Date"
                      value={checkIn && checkOut ? `${checkIn} - ${checkOut}` : ''}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                      readOnly
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 flex items-center justify-center text-base"
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
        className="py-16 lg:py-20 px-4 lg:px-16 bg-white"
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
        className="py-16 lg:py-20 px-4 lg:px-16 bg-white"
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

          {/* Room Type Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {roomTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveRoomType(type)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeRoomType === type
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
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
                    <span className="mr-1">📍</span>
                    <span className="text-sm">{listing.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{listing.price.toLocaleString('en-IN')}</span>
                      <span className="text-gray-600 text-sm ml-1">/night</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-1">★</span>
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
        className="py-16 px-4 lg:px-16 bg-white"
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
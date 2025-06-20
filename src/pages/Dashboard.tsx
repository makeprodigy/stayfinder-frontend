import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';

interface Booking {
  _id: string;
  listing: {
    _id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await apiClient.get<Booking[]>('/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Failed to load bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 w-12 h-12 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group mb-6"
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

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            Manage your current and past reservations
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring amazing properties and make your first booking!
            </p>
            <button
              onClick={() => navigate('/listings')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-80">
                    <img
                      src={booking.listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                      alt={booking.listing.title}
                      className="w-full h-48 md:h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/listing/${booking.listing._id}`)}
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.listing.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {booking.listing.location}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Check-in</p>
                        <p className="font-semibold">
                          {new Date(booking.startDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Check-out</p>
                        <p className="font-semibold">
                          {new Date(booking.endDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24))} nights
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{(booking.listing.price * Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24))).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/listing/${booking.listing._id}`)}
                        className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View Property
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
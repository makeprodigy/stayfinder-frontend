import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetails from './pages/ListingDetails';
import Listings from './pages/Listings';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ListingDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

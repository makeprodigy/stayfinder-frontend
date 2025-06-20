# 🏨 StayFinder Frontend

A modern, responsive React frontend for the StayFinder hotel booking platform. Built with TypeScript, Tailwind CSS, and Material-UI for a seamless user experience across all devices.

## 🚀 Live Demo

**Live Application**: [https://stayfinder-frontend-rho.vercel.app/](https://stayfinder-frontend-rho.vercel.app/)

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Date Picker**: React DatePicker
- **Build Tool**: Create React App with CRACO
- **Deployment**: Vercel

## ✨ Features

### 🏠 Homepage
- Hero section with search functionality
- Featured property cards with images and pricing
- Responsive design with smooth animations
- Advanced search with location, guests, and date filters

### 🔍 Property Listings
- Grid layout with beautiful property cards
- Advanced filtering (location, price range, text search)
- Real-time search results
- Favorite properties functionality
- Responsive design for all screen sizes

### 🏨 Property Details
- Detailed property information with image gallery
- Interactive booking calendar
- Guest selection and pricing calculation
- Host information and contact details
- Responsive booking widget

### 🔐 Authentication
- Beautiful login/register forms with validation
- JWT token management
- Automatic redirects and protected routes
- Remember me functionality

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Smooth animations and transitions

### 🎨 UI/UX Excellence
- Modern glassmorphism design
- Gradient backgrounds and smooth animations
- Professional typography and spacing
- Consistent color scheme and branding

## 🎯 Key Pages

### 🏠 Home (`/`)
- Hero section with search
- Featured properties
- Call-to-action buttons

### 📋 Listings (`/listings`)
- Property grid with filters
- Search functionality
- Real-time results

### 🏨 Property Details (`/listing/:id`)
- Detailed property view
- Booking interface
- Host information

### 🔐 Authentication
- **Login** (`/login`)
- **Register** (`/register`)

### 📊 Dashboard (`/dashboard`)
- User booking management
- Booking history

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/makeprodigy/stayfinder-frontend.git
   cd stayfinder-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your backend URL:
   ```env
   REACT_APP_API_URL=https://stayfinder-backend-ygil.onrender.com/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
stayfinder-frontend/
├── public/
│   ├── index.html           # HTML template
│   └── favicon.ico          # App favicon
├── src/
│   ├── api/
│   │   └── axios.ts         # API configuration
│   ├── components/
│   │   ├── Navbar.tsx       # Navigation component
│   │   └── CustomDropdown.tsx # Reusable dropdown
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Listings.tsx     # Property listings
│   │   ├── ListingDetails.tsx # Property details
│   │   ├── Login.tsx        # Login form
│   │   ├── Register.tsx     # Registration form
│   │   └── Dashboard.tsx    # User dashboard
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── App.tsx              # Main app component
│   ├── index.tsx            # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── craco.config.js         # Build configuration
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3B82F6 to #6366F1)
- **Secondary**: Yellow accent (#F59E0B)
- **Background**: Warm gradients (amber/orange)
- **Text**: Gray scale for hierarchy

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable fonts
- **Spacing**: Consistent scale (4px base)

### Components
- **Cards**: Rounded corners with shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Material-UI with custom styling
- **Navigation**: Responsive with mobile menu

## 🔄 API Integration

### Axios Configuration
```typescript
// Automatic token attachment
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// Automatic auth error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Key API Calls
```typescript
// Get all listings
const listings = await apiClient.get('/listings');

// Get listing details
const listing = await apiClient.get(`/listings/${id}`);

// Create booking
const booking = await apiClient.post('/bookings', bookingData);

// User authentication
const auth = await apiClient.post('/auth/login', credentials);
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### Features
- Touch-friendly buttons and interactions
- Responsive navigation with mobile menu
- Flexible grid layouts
- Optimized images and content

## 🚀 Build & Deployment

### Build Commands
```bash
# Development
npm start

# Production build
npm run build

# Test build
npm run test
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables:
   ```env
   REACT_APP_API_URL=https://stayfinder-backend-ygil.onrender.com/api
   ```
3. Deploy automatically on push to main branch

### Build Configuration
- **Framework**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Node Version**: 18.x

## 🧪 Testing

### Manual Testing Checklist
- [ ] Homepage loads and displays properties
- [ ] Search filters work correctly
- [ ] Property details page functions
- [ ] Login/Register forms validate
- [ ] Booking process completes
- [ ] Responsive design on all devices

### Browser Compatibility
- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers

## 🔒 Security Features

- **Token Storage**: Secure localStorage management
- **Route Protection**: Auth guards for protected pages
- **Input Validation**: Form validation and sanitization
- **HTTPS**: Secure communication with backend
- **Error Handling**: Graceful error boundaries

## 🎯 Performance Optimizations

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Optimized asset delivery
- **Caching**: Browser caching strategies
- **Bundle Size**: Minimized JavaScript bundles
- **CDN**: Fast content delivery via Vercel

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related

- **Backend Repository**: [stayfinder-backend](https://github.com/makeprodigy/stayfinder-backend)
- **Backend API**: [StayFinder API](https://stayfinder-backend-ygil.onrender.com)

## 🙏 Acknowledgments

- **Design Inspiration**: Airbnb, Booking.com
- **Icons**: Heroicons
- **Images**: Unsplash
- **Deployment**: Vercel

import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Layouts
import PublicLayout from './components/common/PublicLayout';
import CustomerLayout from './components/customer/CustomerLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import CarsPage from './pages/public/CarsPage';
import CarDetailsPage from './pages/public/CarDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import BookingDetails from './pages/customer/BookingDetails';
import NewBooking from './pages/customer/NewBooking';
import CustomerProfile from './pages/customer/CustomerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';

// Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  const { fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      fetchProfile();
    }
  }, [fetchProfile, isAuthenticated]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Customer Routes */}
      <Route element={<ProtectedRoute><CustomerLayout /></ProtectedRoute>}>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/customer/bookings" element={<CustomerBookings />} />
        <Route path="/customer/bookings/:id" element={<BookingDetails />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
      </Route>

      {/* Booking Flow */}
      <Route element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
        <Route path="/booking/:carId" element={<NewBooking />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cars" element={<AdminCars />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
      </Route>
    </Routes>
  );
}

export default App;

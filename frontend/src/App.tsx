import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PublicLayout from "./components/common/PublicLayout";
import DashboardLayout from "./components/common/DashboardLayout";
import AdminLayout from "./components/common/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Cars = lazy(() => import("./pages/Cars"));
const CarDetail = lazy(() => import("./pages/CarDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Dashboard Pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Bookings = lazy(() => import("./pages/dashboard/Bookings"));
const Favorites = lazy(() => import("./pages/dashboard/Favorites"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCars = lazy(() => import("./pages/admin/AdminCars"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullScreen text="جاري التحميل..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/:id" element={<CarDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes (Protected) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes (Protected + Admin Only) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

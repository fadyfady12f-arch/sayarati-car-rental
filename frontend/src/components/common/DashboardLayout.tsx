import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  LayoutDashboard,
  Calendar,
  Heart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/dashboard' },
  { icon: Calendar, label: 'حجوزاتي', href: '/dashboard/bookings' },
  { icon: Heart, label: 'المفضلة', href: '/dashboard/favorites' },
  { icon: CreditCard, label: 'المدفوعات', href: '/dashboard/payments' },
  { icon: User, label: 'الملف الشخصي', href: '/dashboard/profile' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings' },
  { icon: HelpCircle, label: 'المساعدة', href: '/dashboard/help' },
];

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">سيارتي</span>
        </Link>
        <div className="mr-auto">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
              />
            )}

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: sidebarOpen ? 0 : '100%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className={`fixed top-0 right-0 h-full w-72 bg-white border-l border-gray-200 z-50
                        lg:translate-x-0 lg:z-30 ${!sidebarOpen ? 'lg:block hidden' : ''}`}
            >
              {/* Logo */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">سيارتي</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 font-bold text-lg">
                        {user?.firstName?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive(item.href) && (
                          <ChevronLeft className="w-4 h-4 mr-auto" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Logout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:mr-72 pt-16 lg:pt-0 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {menuItems.find((item) => isActive(item.href))?.label || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link
              to="/cars"
              className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              استأجر سيارة
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-16 left-4 lg:left-auto lg:right-80 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">الإشعارات</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <p className="text-sm text-gray-800">تم تأكيد حجزك بنجاح</p>
                    <p className="text-xs text-gray-500 mt-1">منذ ساعة</p>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-primary-600 text-sm font-medium hover:text-primary-700"
                >
                  عرض جميع الإشعارات
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;

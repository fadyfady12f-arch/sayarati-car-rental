import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Building,
  Tag,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/admin' },
  { icon: Car, label: 'السيارات', href: '/admin/cars' },
  { icon: Calendar, label: 'الحجوزات', href: '/admin/bookings' },
  { icon: Users, label: 'العملاء', href: '/admin/customers' },
  { icon: CreditCard, label: 'المدفوعات', href: '/admin/payments' },
  { icon: Building, label: 'الفروع', href: '/admin/branches' },
  { icon: Tag, label: 'الكوبونات', href: '/admin/coupons' },
  { icon: MessageSquare, label: 'الدعم الفني', href: '/admin/support' },
  { icon: Wrench, label: 'الصيانة', href: '/admin/maintenance' },
  { icon: BarChart3, label: 'التقارير', href: '/admin/reports' },
  { icon: Settings, label: 'الإعدادات', href: '/admin/settings' },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 z-40 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/admin" className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">لوحة الإدارة</span>
        </Link>
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
              className={`fixed top-0 right-0 h-full bg-gray-900 z-50 transition-all duration-300
                        lg:translate-x-0 lg:z-30 ${!sidebarOpen ? 'lg:block hidden' : ''}
                        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
            >
              {/* Logo */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-lg font-bold text-white">الإدارة</span>
                  )}
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block p-2 text-gray-400 hover:text-white"
                >
                  <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="p-3 overflow-y-auto h-[calc(100vh-140px)]">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* User & Logout */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-gray-500 text-xs truncate">مدير</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${
                    sidebarCollapsed ? 'justify-center' : ''
                  }`}
                  title={sidebarCollapsed ? 'تسجيل الخروج' : undefined}
                >
                  <LogOut className="w-5 h-5" />
                  {!sidebarCollapsed && <span className="font-medium">تسجيل الخروج</span>}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 lg:pt-0 min-h-screen ${
        sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64'
      }`}>
        {/* Top Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {menuItems.find((item) => isActive(item.href))?.label || 'لوحة التحكم'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/" className="btn-outline py-2 px-4 text-sm">
              زيارة الموقع
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

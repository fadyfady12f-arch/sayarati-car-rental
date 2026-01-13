import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Car, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'السيارات', href: '/cars' },
    { label: 'الفروع', href: '/branches' },
    { label: 'من نحن', href: '/about' },
    { label: 'اتصل بنا', href: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isScrolled ? 'bg-primary-600' : 'bg-white/20 backdrop-blur'}`}>
              <Car className={`w-8 h-8 ${isScrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              تأجير السيارات
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium transition-colors hover:text-primary-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } ${location.pathname === item.href ? 'text-primary-500' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isScrolled
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>{user.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      {user.role === 'CUSTOMER' ? (
                        <>
                          <Link
                            to="/customer"
                            className="block px-4 py-3 hover:bg-gray-50 text-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            لوحة التحكم
                          </Link>
                          <Link
                            to="/customer/bookings"
                            className="block px-4 py-3 hover:bg-gray-50 text-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            حجوزاتي
                          </Link>
                          <Link
                            to="/customer/profile"
                            className="block px-4 py-3 hover:bg-gray-50 text-gray-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            الملف الشخصي
                          </Link>
                        </>
                      ) : (
                        <Link
                          to="/admin"
                          className="block px-4 py-3 hover:bg-gray-50 text-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          لوحة الإدارة
                        </Link>
                      )}
                      <hr className="border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-right px-4 py-3 hover:bg-gray-50 text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white'
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    isScrolled
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-white text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block py-3 text-gray-700 hover:text-primary-600 font-medium"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-4" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === 'CUSTOMER' ? '/customer' : '/admin'}
                    className="block py-3 text-gray-700 hover:text-primary-600 font-medium"
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right py-3 text-red-600 font-medium"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <div className="flex gap-4 pt-2">
                  <Link to="/login" className="btn-outline flex-1 text-center">
                    تسجيل الدخول
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-center">
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

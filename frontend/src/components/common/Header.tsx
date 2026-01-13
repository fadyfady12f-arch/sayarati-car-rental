import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Car, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'السيارات', href: '/cars' },
    { label: 'من نحن', href: '/about' },
    { label: 'اتصل بنا', href: '/contact' },
  ];

  const isHome = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isScrolled || !isHome ? 'bg-primary-500' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${
              isScrolled || !isHome ? 'text-gray-900' : 'text-white'
            }`}>
              سيارتي
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors ${
                  isScrolled || !isHome
                    ? 'text-gray-700 hover:text-primary-500'
                    : 'text-white/90 hover:text-white'
                } ${location.pathname === link.href ? 'text-primary-500' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isScrolled || !isHome
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.firstName?.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      لوحة التحكم
                    </Link>
                    {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50"
                      >
                        <Car className="w-4 h-4" />
                        الإدارة
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`font-medium transition-colors ${
                    isScrolled || !isHome
                      ? 'text-gray-700 hover:text-primary-500'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled || !isHome ? 'text-gray-700' : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gray-700 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-red-600"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block btn-primary text-center"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;

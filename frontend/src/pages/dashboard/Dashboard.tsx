import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Car,
  CreditCard,
  TrendingUp,
  Clock,
  MapPin,
  ChevronLeft,
  Star
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import { useAuthStore } from '../../stores/authStore';

// Mock data
const stats = [
  { label: 'إجمالي الحجوزات', value: '12', icon: Calendar, color: 'bg-blue-500' },
  { label: 'حجوزات نشطة', value: '2', icon: Car, color: 'bg-green-500' },
  { label: 'إجمالي الإنفاق', value: formatPrice(2500000), icon: CreditCard, color: 'bg-purple-500' },
  { label: 'نقاط الولاء', value: '450', icon: TrendingUp, color: 'bg-orange-500' },
];

const recentBookings = [
  {
    id: '1',
    car: 'مرسيدس E-Class',
    image: '/images/cars/mercedes-e-class.jpg',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    status: 'active',
    total: 750000,
  },
  {
    id: '2',
    car: 'بي إم دبليو X5',
    image: '/images/cars/bmw-x5.jpg',
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    status: 'completed',
    total: 360000,
  },
  {
    id: '3',
    car: 'تويوتا كامري',
    image: '/images/cars/toyota-camry.jpg',
    startDate: '2024-01-05',
    endDate: '2024-01-07',
    status: 'completed',
    total: 160000,
  },
];

const recommendedCars = [
  {
    id: '1',
    name: 'أودي A6',
    image: '/images/cars/audi-a6.jpg',
    pricePerDay: 140000,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'لكزس ES',
    image: '/images/cars/lexus-es.jpg',
    pricePerDay: 130000,
    rating: 4.7,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">نشط</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">قيد الانتظار</span>;
    case 'completed':
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">مكتمل</span>;
    case 'cancelled':
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">ملغي</span>;
    default:
      return null;
  }
};

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-l from-primary-600 to-primary-500 rounded-2xl p-6 text-white"
      >
        <h2 className="text-2xl font-bold mb-2">
          مرحباً، {user?.firstName}!
        </h2>
        <p className="text-primary-100">
          نتمنى لك يوماً سعيداً. هل تبحث عن سيارة جديدة؟
        </p>
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 mt-4 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium
                   hover:bg-primary-50 transition-colors"
        >
          تصفح السيارات
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm"
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">آخر الحجوزات</h3>
            <Link
              to="/dashboard/bookings"
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              عرض الكل
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="p-5 flex items-center gap-4">
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={booking.image}
                    alt={booking.car}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/car-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{booking.car}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{booking.startDate} - {booking.endDate}</span>
                  </div>
                </div>
                <div className="text-left">
                  {getStatusBadge(booking.status)}
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {formatPrice(booking.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommended Cars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">قد يعجبك أيضاً</h3>
          </div>
          <div className="p-5 space-y-4">
            {recommendedCars.map((car) => (
              <Link
                key={car.id}
                to={`/cars/${car.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/car-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{car.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-primary-600 font-medium text-sm">
                      {formatPrice(car.pricePerDay)}/يوم
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{car.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              to="/cars"
              className="block text-center text-primary-600 font-medium hover:text-primary-700 pt-2"
            >
              عرض المزيد
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Active Booking Card */}
      {recentBookings.filter((b) => b.status === 'active').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="font-bold text-gray-900 mb-4">حجزك الحالي</h3>
          {recentBookings
            .filter((b) => b.status === 'active')
            .map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-green-50 rounded-xl"
              >
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden">
                  <img
                    src={booking.image}
                    alt={booking.car}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/car-placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{booking.car}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>من: {booking.startDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>إلى: {booking.endDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>فرع دمشق - المزة</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>{formatPrice(booking.total)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to={`/dashboard/bookings/${booking.id}`}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    تفاصيل الحجز
                  </Link>
                  <button className="btn-outline py-2 px-4 text-sm">
                    تمديد الحجز
                  </button>
                </div>
              </div>
            ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;

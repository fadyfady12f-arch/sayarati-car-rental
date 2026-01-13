import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  Eye,
  X,
  Download,
  Car
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

// Mock bookings data
const bookings = [
  {
    id: 'BK-2024-001',
    car: {
      name: 'مرسيدس E-Class',
      image: '/images/cars/mercedes-e-class.jpg',
    },
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    pickupBranch: 'فرع دمشق - المزة',
    dropoffBranch: 'فرع دمشق - المزة',
    status: 'active',
    total: 750000,
    paid: true,
    createdAt: '2024-01-18',
  },
  {
    id: 'BK-2024-002',
    car: {
      name: 'بي إم دبليو X5',
      image: '/images/cars/bmw-x5.jpg',
    },
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    pickupBranch: 'فرع دمشق - المالكي',
    dropoffBranch: 'فرع دمشق - المالكي',
    status: 'completed',
    total: 360000,
    paid: true,
    createdAt: '2024-01-08',
  },
  {
    id: 'BK-2024-003',
    car: {
      name: 'تويوتا كامري',
      image: '/images/cars/toyota-camry.jpg',
    },
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    pickupBranch: 'فرع حلب',
    dropoffBranch: 'فرع حلب',
    status: 'pending',
    total: 160000,
    paid: false,
    createdAt: '2024-01-25',
  },
  {
    id: 'BK-2024-004',
    car: {
      name: 'هيونداي إلنترا',
      image: '/images/cars/hyundai-elantra.jpg',
    },
    startDate: '2024-01-05',
    endDate: '2024-01-07',
    pickupBranch: 'فرع اللاذقية',
    dropoffBranch: 'فرع اللاذقية',
    status: 'cancelled',
    total: 100000,
    paid: false,
    createdAt: '2024-01-03',
  },
];

const statusFilters = [
  { id: 'all', label: 'الكل' },
  { id: 'active', label: 'نشط' },
  { id: 'pending', label: 'قيد الانتظار' },
  { id: 'completed', label: 'مكتمل' },
  { id: 'cancelled', label: 'ملغي' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">نشط</span>;
    case 'pending':
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">قيد الانتظار</span>;
    case 'completed':
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">مكتمل</span>;
    case 'cancelled':
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">ملغي</span>;
    default:
      return null;
  }
};

const Bookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (searchQuery && !booking.id.includes(searchQuery) && !booking.car.name.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">حجوزاتي</h1>
          <p className="text-gray-600">إدارة وتتبع جميع حجوزاتك</p>
        </div>
        <Link to="/cars" className="btn-primary flex items-center gap-2">
          <Car className="w-4 h-4" />
          حجز جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث برقم الحجز أو اسم السيارة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {statusFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === filter.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Car Image */}
                  <div className="w-full lg:w-40 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car-placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{booking.car.name}</h3>
                        <p className="text-sm text-gray-500">رقم الحجز: {booking.id}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
                        <span>الاستلام: {booking.pickupBranch}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>التسليم: {booking.dropoffBranch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                    <div className="text-left">
                      <p className="text-sm text-gray-500">الإجمالي</p>
                      <p className="text-xl font-bold text-primary-600">
                        {formatPrice(booking.total)}
                      </p>
                      <p className={`text-xs ${booking.paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {booking.paid ? 'مدفوع' : 'غير مدفوع'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn-outline py-2 px-3 text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        التفاصيل
                      </button>
                      {booking.status === 'completed' && (
                        <button className="btn-outline py-2 px-3 text-sm flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          الفاتورة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد حجوزات
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'لم يتم العثور على حجوزات تطابق معايير البحث'
                : 'لم تقم بأي حجوزات بعد'}
            </p>
            <Link to="/cars" className="btn-primary">
              احجز سيارتك الأولى
            </Link>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">تفاصيل الحجز</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Car Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className="w-24 h-16 rounded-lg overflow-hidden">
                    <img
                      src={selectedBooking.car.image}
                      alt={selectedBooking.car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{selectedBooking.car.name}</h4>
                    <p className="text-sm text-gray-500">{selectedBooking.id}</p>
                  </div>
                  <div className="mr-auto">
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">تاريخ الاستلام</p>
                      <p className="font-medium">{selectedBooking.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاريخ التسليم</p>
                      <p className="font-medium">{selectedBooking.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">فرع الاستلام</p>
                      <p className="font-medium">{selectedBooking.pickupBranch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">فرع التسليم</p>
                      <p className="font-medium">{selectedBooking.dropoffBranch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">تاريخ الحجز</p>
                      <p className="font-medium">{selectedBooking.createdAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">حالة الدفع</p>
                      <p className={`font-medium ${selectedBooking.paid ? 'text-green-600' : 'text-orange-600'}`}>
                        {selectedBooking.paid ? 'مدفوع' : 'غير مدفوع'}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الإجمالي</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(selectedBooking.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button className="flex-1 btn-primary">
                        إكمال الدفع
                      </button>
                      <button className="flex-1 btn-outline text-red-600 border-red-200 hover:bg-red-50">
                        إلغاء الحجز
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'active' && (
                    <button className="flex-1 btn-primary">
                      تمديد الحجز
                    </button>
                  )}
                  {selectedBooking.status === 'completed' && (
                    <button className="flex-1 btn-outline">
                      تحميل الفاتورة
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;

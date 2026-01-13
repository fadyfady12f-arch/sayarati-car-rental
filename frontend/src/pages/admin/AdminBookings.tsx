import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  X
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

// Mock data
const bookingsData = [
  {
    id: 'BK-2024-001',
    customer: { name: 'أحمد محمد', email: 'ahmed@email.com', phone: '+963 912 345 678' },
    car: { name: 'مرسيدس E-Class', image: '/images/cars/mercedes-e-class.jpg' },
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    pickupBranch: 'دمشق - المزة',
    dropoffBranch: 'دمشق - المزة',
    status: 'active',
    paymentStatus: 'paid',
    total: 750000,
    createdAt: '2024-01-18',
  },
  {
    id: 'BK-2024-002',
    customer: { name: 'سارة العلي', email: 'sara@email.com', phone: '+963 933 456 789' },
    car: { name: 'بي إم دبليو X5', image: '/images/cars/bmw-x5.jpg' },
    startDate: '2024-01-22',
    endDate: '2024-01-24',
    pickupBranch: 'دمشق - المالكي',
    dropoffBranch: 'دمشق - المالكي',
    status: 'pending',
    paymentStatus: 'pending',
    total: 360000,
    createdAt: '2024-01-20',
  },
  {
    id: 'BK-2024-003',
    customer: { name: 'محمود الحسن', email: 'mahmoud@email.com', phone: '+963 944 567 890' },
    car: { name: 'تويوتا كامري', image: '/images/cars/toyota-camry.jpg' },
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    pickupBranch: 'حلب',
    dropoffBranch: 'حلب',
    status: 'completed',
    paymentStatus: 'paid',
    total: 160000,
    createdAt: '2024-01-13',
  },
  {
    id: 'BK-2024-004',
    customer: { name: 'فاطمة خالد', email: 'fatima@email.com', phone: '+963 955 678 901' },
    car: { name: 'أودي A6', image: '/images/cars/audi-a6.jpg' },
    startDate: '2024-01-10',
    endDate: '2024-01-12',
    pickupBranch: 'اللاذقية',
    dropoffBranch: 'اللاذقية',
    status: 'cancelled',
    paymentStatus: 'refunded',
    total: 280000,
    createdAt: '2024-01-08',
  },
];

const statusFilters = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'معلق' },
  { id: 'active', label: 'نشط' },
  { id: 'completed', label: 'مكتمل' },
  { id: 'cancelled', label: 'ملغي' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">نشط</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">معلق</span>;
    case 'completed':
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">مكتمل</span>;
    case 'cancelled':
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">ملغي</span>;
    default:
      return null;
  }
};

const getPaymentBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <span className="text-green-600 text-xs">مدفوع</span>;
    case 'pending':
      return <span className="text-yellow-600 text-xs">معلق</span>;
    case 'refunded':
      return <span className="text-blue-600 text-xs">مسترد</span>;
    default:
      return null;
  }
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState(bookingsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<typeof bookingsData[0] | null>(null);

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.id.toLowerCase().includes(query) ||
        booking.customer.name.includes(searchQuery) ||
        booking.car.name.includes(searchQuery)
      );
    }
    return true;
  });

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الحجوزات</h1>
          <p className="text-gray-600">إجمالي {bookings.length} حجز</p>
        </div>
        <button className="btn-outline flex items-center gap-2">
          <Download className="w-5 h-5" />
          تصدير
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث برقم الحجز أو اسم العميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pr-10"
            />
          </div>
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

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="p-4 font-medium">رقم الحجز</th>
                <th className="p-4 font-medium">العميل</th>
                <th className="p-4 font-medium">السيارة</th>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">الفرع</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">المبلغ</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-900">{booking.id}</span>
                    <p className="text-xs text-gray-500">{booking.createdAt}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-gray-900">{booking.customer.name}</p>
                    <p className="text-xs text-gray-500">{booking.customer.phone}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-8 rounded overflow-hidden bg-gray-100">
                        <img
                          src={booking.car.image}
                          alt={booking.car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-gray-700">{booking.car.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-700">{booking.startDate}</p>
                    <p className="text-xs text-gray-500">إلى {booking.endDate}</p>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{booking.pickupBranch}</td>
                  <td className="p-4">
                    {getStatusBadge(booking.status)}
                    <div className="mt-1">{getPaymentBadge(booking.paymentStatus)}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {formatPrice(booking.total)}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لم يتم العثور على حجوزات</p>
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

                {/* Booking ID & Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <div>
                    <p className="text-sm text-gray-500">رقم الحجز</p>
                    <p className="font-bold text-gray-900">{selectedBooking.id}</p>
                  </div>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">معلومات العميل</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">الاسم:</span> {selectedBooking.customer.name}</p>
                    <p><span className="text-gray-500">البريد:</span> {selectedBooking.customer.email}</p>
                    <p><span className="text-gray-500">الهاتف:</span> {selectedBooking.customer.phone}</p>
                  </div>
                </div>

                {/* Car Info */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">السيارة</h4>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-20 h-14 rounded-lg overflow-hidden">
                      <img
                        src={selectedBooking.car.image}
                        alt={selectedBooking.car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-medium">{selectedBooking.car.name}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">تفاصيل الحجز</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">من</p>
                      <p className="font-medium">{selectedBooking.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">إلى</p>
                      <p className="font-medium">{selectedBooking.endDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">فرع الاستلام</p>
                      <p className="font-medium">{selectedBooking.pickupBranch}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">فرع التسليم</p>
                      <p className="font-medium">{selectedBooking.dropoffBranch}</p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl mb-6">
                  <span className="font-semibold text-gray-900">الإجمالي</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(selectedBooking.total)}
                  </span>
                </div>

                {/* Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'active')}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      تأكيد الحجز
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      className="flex-1 btn-outline text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      رفض
                    </button>
                  </div>
                )}
                {selectedBooking.status === 'active' && (
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    إتمام الحجز
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;

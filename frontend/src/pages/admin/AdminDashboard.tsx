import { motion } from 'framer-motion';
import {
  Car,
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

// Mock data
const stats = [
  {
    label: 'إجمالي السيارات',
    value: '156',
    change: '+12',
    trend: 'up',
    icon: Car,
    color: 'bg-blue-500',
  },
  {
    label: 'الحجوزات النشطة',
    value: '48',
    change: '+8',
    trend: 'up',
    icon: Calendar,
    color: 'bg-green-500',
  },
  {
    label: 'العملاء',
    value: '2,845',
    change: '+124',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    label: 'الإيرادات الشهرية',
    value: formatPrice(45000000),
    change: '+15%',
    trend: 'up',
    icon: CreditCard,
    color: 'bg-orange-500',
  },
];

const recentBookings = [
  {
    id: 'BK-001',
    customer: 'أحمد محمد',
    car: 'مرسيدس E-Class',
    date: '2024-01-20',
    status: 'active',
    amount: 750000,
  },
  {
    id: 'BK-002',
    customer: 'سارة العلي',
    car: 'بي إم دبليو X5',
    date: '2024-01-19',
    status: 'pending',
    amount: 540000,
  },
  {
    id: 'BK-003',
    customer: 'محمود الحسن',
    car: 'تويوتا كامري',
    date: '2024-01-18',
    status: 'completed',
    amount: 240000,
  },
  {
    id: 'BK-004',
    customer: 'فاطمة خالد',
    car: 'أودي A6',
    date: '2024-01-17',
    status: 'completed',
    amount: 420000,
  },
];

const topCars = [
  { name: 'مرسيدس E-Class', bookings: 45, revenue: 6750000 },
  { name: 'بي إم دبليو X5', bookings: 38, revenue: 6840000 },
  { name: 'تويوتا كامري', bookings: 52, revenue: 4160000 },
  { name: 'أودي A6', bookings: 32, revenue: 4480000 },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">نشط</span>;
    case 'pending':
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">معلق</span>;
    case 'completed':
      return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">مكتمل</span>;
    default:
      return null;
  }
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
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
            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
              عرض الكل
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500 border-b border-gray-100">
                  <th className="p-4 font-medium">رقم الحجز</th>
                  <th className="p-4 font-medium">العميل</th>
                  <th className="p-4 font-medium">السيارة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">المبلغ</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{booking.id}</td>
                    <td className="p-4 text-sm text-gray-700">{booking.customer}</td>
                    <td className="p-4 text-sm text-gray-700">{booking.car}</td>
                    <td className="p-4 text-sm text-gray-500">{booking.date}</td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {formatPrice(booking.amount)}
                    </td>
                    <td className="p-4">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Cars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">السيارات الأكثر حجزاً</h3>
          </div>
          <div className="p-5 space-y-4">
            {topCars.map((car, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{car.name}</h4>
                  <p className="text-xs text-gray-500">{car.bookings} حجز</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(car.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">حالة السيارات</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">متاحة</span>
              <span className="text-sm font-medium text-green-600">108</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مؤجرة</span>
              <span className="text-sm font-medium text-blue-600">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">في الصيانة</span>
              <span className="text-sm font-medium text-orange-600">6</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">الحجوزات اليوم</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">جديدة</span>
              <span className="text-sm font-medium text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">تسليم</span>
              <span className="text-sm font-medium text-gray-900">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">استلام</span>
              <span className="text-sm font-medium text-gray-900">5</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">الدعم الفني</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">تذاكر مفتوحة</span>
              <span className="text-sm font-medium text-red-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">قيد المعالجة</span>
              <span className="text-sm font-medium text-yellow-600">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">مغلقة اليوم</span>
              <span className="text-sm font-medium text-green-600">12</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

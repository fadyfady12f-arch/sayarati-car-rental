import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Car
} from 'lucide-react';
import { formatPrice } from '../../utils/helpers';

// Mock data
const carsData = [
  {
    id: '1',
    name: 'مرسيدس E-Class',
    brand: 'Mercedes',
    model: 'E300',
    year: 2024,
    image: '/images/cars/mercedes-e-class.jpg',
    pricePerDay: 150000,
    category: 'فاخرة',
    status: 'available',
    branch: 'دمشق - المزة',
    bookings: 45,
  },
  {
    id: '2',
    name: 'بي إم دبليو X5',
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    image: '/images/cars/bmw-x5.jpg',
    pricePerDay: 180000,
    category: 'SUV',
    status: 'rented',
    branch: 'دمشق - المالكي',
    bookings: 38,
  },
  {
    id: '3',
    name: 'تويوتا كامري',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    image: '/images/cars/toyota-camry.jpg',
    pricePerDay: 80000,
    category: 'سيدان',
    status: 'available',
    branch: 'حلب',
    bookings: 52,
  },
  {
    id: '4',
    name: 'أودي A6',
    brand: 'Audi',
    model: 'A6',
    year: 2024,
    image: '/images/cars/audi-a6.jpg',
    pricePerDay: 140000,
    category: 'فاخرة',
    status: 'maintenance',
    branch: 'دمشق - المزة',
    bookings: 32,
  },
];

const statusOptions = [
  { id: 'all', label: 'الكل' },
  { id: 'available', label: 'متاح' },
  { id: 'rented', label: 'مؤجر' },
  { id: 'maintenance', label: 'صيانة' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">متاح</span>;
    case 'rented':
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">مؤجر</span>;
    case 'maintenance':
      return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">صيانة</span>;
    default:
      return null;
  }
};

const AdminCars = () => {
  const [cars, setCars] = useState(carsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<typeof carsData[0] | null>(null);

  const filteredCars = cars.filter((car) => {
    if (statusFilter !== 'all' && car.status !== statusFilter) return false;
    if (searchQuery && !car.name.includes(searchQuery) && !car.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const deleteCar = (carId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
      setCars((prev) => prev.filter((car) => car.id !== carId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة السيارات</h1>
          <p className="text-gray-600">إجمالي {cars.length} سيارة</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة سيارة
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الماركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pr-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setStatusFilter(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === option.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-right text-sm text-gray-500 border-b border-gray-100 bg-gray-50">
                <th className="p-4 font-medium">السيارة</th>
                <th className="p-4 font-medium">الفئة</th>
                <th className="p-4 font-medium">السعر/يوم</th>
                <th className="p-4 font-medium">الفرع</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium">الحجوزات</th>
                <th className="p-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/car-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{car.name}</p>
                        <p className="text-sm text-gray-500">{car.brand} {car.model} • {car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{car.category}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {formatPrice(car.pricePerDay)}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{car.branch}</td>
                  <td className="p-4">{getStatusBadge(car.status)}</td>
                  <td className="p-4 text-sm text-gray-700">{car.bookings}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCar(car)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCar(car.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لم يتم العثور على سيارات</p>
          </div>
        )}
      </div>

      {/* Add/Edit Car Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">إضافة سيارة جديدة</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صور السيارة
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">اسحب الصور هنا أو انقر للاختيار</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG حتى 5MB</p>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الماركة
                      </label>
                      <input type="text" className="input-field" placeholder="Mercedes" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الموديل
                      </label>
                      <input type="text" className="input-field" placeholder="E-Class" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السنة
                      </label>
                      <input type="number" className="input-field" placeholder="2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفئة
                      </label>
                      <select className="input-field">
                        <option value="">اختر الفئة</option>
                        <option value="economy">اقتصادية</option>
                        <option value="sedan">سيدان</option>
                        <option value="suv">SUV</option>
                        <option value="luxury">فاخرة</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر اليومي
                      </label>
                      <input type="number" className="input-field" placeholder="150000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر الأسبوعي
                      </label>
                      <input type="number" className="input-field" placeholder="900000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        السعر الشهري
                      </label>
                      <input type="number" className="input-field" placeholder="3000000" />
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد المقاعد
                      </label>
                      <select className="input-field">
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="8">8+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ناقل الحركة
                      </label>
                      <select className="input-field">
                        <option value="automatic">أوتوماتيك</option>
                        <option value="manual">يدوي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع الوقود
                      </label>
                      <select className="input-field">
                        <option value="petrol">بنزين</option>
                        <option value="diesel">ديزل</option>
                        <option value="hybrid">هايبرد</option>
                        <option value="electric">كهربائي</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الفرع
                      </label>
                      <select className="input-field">
                        <option value="">اختر الفرع</option>
                        <option value="1">دمشق - المزة</option>
                        <option value="2">دمشق - المالكي</option>
                        <option value="3">حلب</option>
                        <option value="4">اللاذقية</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوصف
                    </label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="وصف السيارة..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 btn-outline"
                    >
                      إلغاء
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      حفظ السيارة
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCars;

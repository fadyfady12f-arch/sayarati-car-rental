import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Search, Car, Users, Fuel, Settings2 } from 'lucide-react';

const branches = [
  { id: '1', name: 'دمشق - المزة' },
  { id: '2', name: 'دمشق - المالكي' },
  { id: '3', name: 'حلب - العزيزية' },
  { id: '4', name: 'اللاذقية - المركز' },
  { id: '5', name: 'حمص - الحمرا' },
];

const carTypes = [
  { id: 'sedan', label: 'سيدان', icon: Car },
  { id: 'suv', label: 'SUV', icon: Car },
  { id: 'luxury', label: 'فاخرة', icon: Car },
  { id: 'economy', label: 'اقتصادية', icon: Car },
];

const SearchForm = () => {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    dropoffDate: '',
    dropoffTime: '',
    carType: '',
    passengers: '',
    transmission: '',
    fuelType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative -mt-20 z-30 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <form onSubmit={handleSubmit}>
            {/* Main Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  موقع الاستلام
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="input-field pr-10"
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  موقع التسليم
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    className="input-field pr-10"
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  تاريخ ووقت الاستلام
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      className="input-field pr-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    className="input-field w-28"
                  />
                </div>
              </div>

              {/* Dropoff Date & Time */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  تاريخ ووقت التسليم
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dropoffDate"
                      value={formData.dropoffDate}
                      onChange={handleChange}
                      className="input-field pr-10"
                      min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <input
                    type="time"
                    name="dropoffTime"
                    value={formData.dropoffTime}
                    onChange={handleChange}
                    className="input-field w-28"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <Settings2 className="w-4 h-4" />
                {showAdvanced ? 'إخفاء الفلاتر المتقدمة' : 'فلاتر متقدمة'}
              </button>
            </div>

            {/* Advanced Filters */}
            <motion.div
              initial={false}
              animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
                {/* Car Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    نوع السيارة
                  </label>
                  <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">جميع الأنواع</option>
                    {carTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passengers */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    عدد الركاب
                  </label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="input-field pr-10"
                    >
                      <option value="">أي عدد</option>
                      <option value="2">2 ركاب</option>
                      <option value="4">4 ركاب</option>
                      <option value="5">5 ركاب</option>
                      <option value="7">7 ركاب</option>
                      <option value="8">8+ ركاب</option>
                    </select>
                  </div>
                </div>

                {/* Transmission */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ناقل الحركة
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">الكل</option>
                    <option value="automatic">أوتوماتيك</option>
                    <option value="manual">يدوي</option>
                  </select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    نوع الوقود
                  </label>
                  <div className="relative">
                    <Fuel className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      className="input-field pr-10"
                    >
                      <option value="">الكل</option>
                      <option value="petrol">بنزين</option>
                      <option value="diesel">ديزل</option>
                      <option value="hybrid">هايبرد</option>
                      <option value="electric">كهربائي</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              ابحث عن سيارتك
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchForm;

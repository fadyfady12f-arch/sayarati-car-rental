import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Fuel,
  Settings,
  Heart,
  MapPin,
  Calendar,
  Check,
  ChevronLeft,
  Shield,
  Phone,
} from "lucide-react";
import { formatPrice } from "../utils/helpers";

const carData = {
  id: "1",
  name: "مرسيدس E-Class",
  brand: "Mercedes",
  model: "E300",
  year: 2024,
  pricePerDay: 150000,
  rating: 4.9,
  reviews: 128,
  seats: 5,
  transmission: "أوتوماتيك",
  fuelType: "بنزين",
  category: "فاخرة",
  description:
    "سيارة مرسيدس E-Class 2024 الجديدة، تجمع بين الأناقة والأداء المتميز.",
  features: [
    "نظام ملاحة GPS",
    "كاميرا خلفية",
    "مقاعد جلدية",
    "بلوتوث",
    "فتحة سقف",
  ],
  branch: { name: "فرع دمشق - المزة", address: "شارع المزة، بناء رقم 15" },
};

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary-600"
          >
            الرئيسية
          </button>
          <ChevronLeft className="w-4 h-4" />
          <button
            onClick={() => navigate("/cars")}
            className="hover:text-primary-600"
          >
            السيارات
          </button>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{carData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                <span className="text-gray-500 text-xl">صورة السيارة</span>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isFavorite
                      ? "bg-red-500 text-white"
                      : "bg-white/80 text-gray-700"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {carData.name}
                  </h1>
                  <p className="text-gray-600">
                    {carData.brand} {carData.model} • {carData.year}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-xl">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">
                    {carData.rating}
                  </span>
                  <span className="text-gray-500">({carData.reviews})</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100">
                <div className="text-center">
                  <Users className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">المقاعد</p>
                  <p className="font-semibold">{carData.seats}</p>
                </div>
                <div className="text-center">
                  <Settings className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">ناقل الحركة</p>
                  <p className="font-semibold">{carData.transmission}</p>
                </div>
                <div className="text-center">
                  <Fuel className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">الوقود</p>
                  <p className="font-semibold">{carData.fuelType}</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">التأمين</p>
                  <p className="font-semibold">شامل</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">الوصف</h3>
                <p className="text-gray-600">{carData.description}</p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">المميزات</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {carData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm sticky top-24"
            >
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(carData.pricePerDay)}
                </span>
                <span className="text-gray-500">/ يوم</span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الاستلام
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="input-field pr-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ التسليم
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dropoffDate}
                      onChange={(e) => setDropoffDate(e.target.value)}
                      className="input-field pr-10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {carData.branch.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {carData.branch.address}
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full btn-primary py-4 text-lg mb-4">
                احجز الآن
              </button>

              <button className="w-full btn-outline py-3 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                اتصل بنا
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;

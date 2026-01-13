import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Users, Fuel, Settings, Trash2 } from "lucide-react";
import { formatPrice } from "../../utils/helpers";

const initialFavorites = [
  {
    id: "1",
    name: "مرسيدس E-Class",
    brand: "Mercedes",
    year: 2024,
    image: "/images/cars/mercedes-e-class.jpg",
    pricePerDay: 150000,
    rating: 4.9,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
  },
  {
    id: "2",
    name: "بي إم دبليو X5",
    brand: "BMW",
    year: 2024,
    image: "/images/cars/bmw-x5.jpg",
    pricePerDay: 180000,
    rating: 4.8,
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "ديزل",
  },
];

const Favorites = () => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((car) => car.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">المفضلة</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="relative aspect-[16/10]">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">صورة السيارة</span>
                </div>
                <button
                  onClick={() => removeFavorite(car.id)}
                  className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{car.name}</h3>
                    <p className="text-sm text-gray-500">
                      {car.brand} • {car.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{car.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {car.seats}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="w-4 h-4" /> {car.transmission}
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="w-4 h-4" /> {car.fuelType}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(car.pricePerDay)}
                    </span>
                    <span className="text-sm text-gray-500 mr-1">/ يوم</span>
                  </div>
                  <Link
                    to={`/cars/${car.id}`}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    احجز
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            قائمة المفضلة فارغة
          </h3>
          <p className="text-gray-600 mb-6">لم تقم بإضافة أي سيارات</p>
          <Link to="/cars" className="btn-primary">
            تصفح السيارات
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;

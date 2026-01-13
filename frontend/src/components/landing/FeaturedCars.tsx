import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Users,
  Fuel,
  Settings,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "../../utils/helpers";

const featuredCars = [
  {
    id: "1",
    name: "مرسيدس E-Class",
    brand: "Mercedes",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 150000,
    rating: 4.9,
    reviews: 128,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "فاخرة",
    featured: true,
  },
  {
    id: "2",
    name: "بي إم دبليو X5",
    brand: "BMW",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 180000,
    rating: 4.8,
    reviews: 96,
    seats: 7,
    transmission: "أوتوماتيك",
    fuelType: "ديزل",
    category: "SUV",
    featured: true,
  },
  {
    id: "3",
    name: "تويوتا كامري",
    brand: "Toyota",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 80000,
    rating: 4.7,
    reviews: 234,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "هايبرد",
    category: "سيدان",
    featured: true,
  },
  {
    id: "4",
    name: "أودي A6",
    brand: "Audi",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 140000,
    rating: 4.8,
    reviews: 87,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "فاخرة",
    featured: true,
  },
  {
    id: "5",
    name: "هيونداي توسان",
    brand: "Hyundai",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1633695269498-15e8f853d2e4?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 70000,
    rating: 4.6,
    reviews: 156,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "SUV",
    featured: true,
  },
  {
    id: "6",
    name: "كيا سبورتاج",
    brand: "Kia",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 65000,
    rating: 4.5,
    reviews: 189,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "SUV",
    featured: true,
  },
];

const filters = ["الكل", "فاخرة", "SUV", "سيدان", "اقتصادية"];

const FeaturedCars = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredCars =
    activeFilter === "الكل"
      ? featuredCars
      : featuredCars.filter((car) => car.category === activeFilter);

  const toggleFavorite = (carId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            سياراتنا المميزة
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            اختر من أفضل السيارات
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف مجموعتنا المختارة من أحدث السيارات بأفضل الأسعار
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Cars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCars.map((car) => (
              <motion.div
                key={car.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/cars/${car.id}`)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/car-placeholder.jpg";
                      }}
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        {car.category}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(car.id, e)}
                      className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center
                               transition-all duration-300 ${
                                 favorites.includes(car.id)
                                   ? "bg-red-500 text-white"
                                   : "bg-white/80 text-gray-700 hover:bg-white"
                               }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${favorites.includes(car.id) ? "fill-current" : ""}`}
                      />
                    </button>

                    {/* Quick View Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      whileHover={{ scale: 1.05 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-2 rounded-lg
                               font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      عرض سريع
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title & Rating */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {car.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {car.brand} • {car.year}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">
                          {car.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({car.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{car.seats}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{car.fuelType}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(car.pricePerDay)}
                        </span>
                        <span className="text-sm text-gray-500 mr-1">
                          / يوم
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary py-2 px-4 text-sm"
                      >
                        احجز الآن
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/cars")}
            className="btn-outline flex items-center gap-2 mx-auto"
          >
            عرض المزيد من السيارات
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCars;

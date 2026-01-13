import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  X,
  Star,
  Users,
  Fuel,
  Settings,
  Heart,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "../utils/helpers";

// Mock data - will be replaced with API call
const allCars = [
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
    category: "luxury",
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
    category: "suv",
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
    category: "sedan",
  },
  {
    id: "4",
    name: "هيونداي إلنترا",
    brand: "Hyundai",
    year: 2024,
    image:
      "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?auto=format&fit=crop&w=800&q=80",
    pricePerDay: 50000,
    rating: 4.5,
    reviews: 189,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "economy",
  },
  {
    id: "5",
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
    category: "luxury",
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
    reviews: 156,
    seats: 5,
    transmission: "أوتوماتيك",
    fuelType: "بنزين",
    category: "suv",
  },
];

const categories = [
  { id: "all", label: "الكل" },
  { id: "economy", label: "اقتصادية" },
  { id: "sedan", label: "سيدان" },
  { id: "suv", label: "SUV" },
  { id: "luxury", label: "فاخرة" },
];

const sortOptions = [
  { id: "popular", label: "الأكثر شعبية" },
  { id: "price_low", label: "السعر: من الأقل للأعلى" },
  { id: "price_high", label: "السعر: من الأعلى للأقل" },
  { id: "rating", label: "التقييم" },
  { id: "newest", label: "الأحدث" },
];

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    [],
  );
  const [selectedFuelType, setSelectedFuelType] = useState<string[]>([]);

  // Filter cars
  const filteredCars = allCars.filter((car) => {
    if (selectedCategory !== "all" && car.category !== selectedCategory)
      return false;
    if (
      searchQuery &&
      !car.name.includes(searchQuery) &&
      !car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (car.pricePerDay < priceRange[0] || car.pricePerDay > priceRange[1])
      return false;
    return true;
  });

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.pricePerDay - b.pricePerDay;
      case "price_high":
        return b.pricePerDay - a.pricePerDay;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.reviews - a.reviews;
    }
  });

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              تصفح السيارات
            </h1>
            <p className="text-gray-600">
              اختر من بين {sortedCars.length} سيارة متاحة للإيجار
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                فلاتر البحث
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">الفئة</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  السعر اليومي
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full accent-primary-500"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Transmission */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  ناقل الحركة
                </h4>
                <div className="space-y-2">
                  {["أوتوماتيك", "يدوي"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTransmission.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTransmission([
                              ...selectedTransmission,
                              type,
                            ]);
                          } else {
                            setSelectedTransmission(
                              selectedTransmission.filter((t) => t !== type),
                            );
                          }
                        }}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">نوع الوقود</h4>
                <div className="space-y-2">
                  {["بنزين", "ديزل", "هايبرد", "كهربائي"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFuelType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFuelType([...selectedFuelType, type]);
                          } else {
                            setSelectedFuelType(
                              selectedFuelType.filter((t) => t !== type),
                            );
                          }
                        }}
                        className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                      />
                      <span className="text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 200000]);
                  setSelectedTransmission([]);
                  setSelectedFuelType([]);
                }}
                className="w-full btn-outline py-2"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن سيارة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pr-10"
                  />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn-outline py-2 px-4 flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    الفلاتر
                  </button>

                  {/* Sort */}
                  <div className="relative flex-1 md:flex-none">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-field appearance-none pl-10 pr-4"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  {/* View Mode */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cars Grid/List */}
            <motion.div
              layout
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence>
                {sortedCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                  >
                    {viewMode === "grid" ? (
                      // Grid Card
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(car.id);
                            }}
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
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {car.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {car.brand} • {car.year}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold">
                                {car.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" /> {car.seats}
                            </span>
                            <span className="flex items-center gap-1">
                              <Settings className="w-4 h-4" />{" "}
                              {car.transmission}
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="w-4 h-4" /> {car.fuelType}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <span className="text-2xl font-bold text-primary-600">
                                {formatPrice(car.pricePerDay)}
                              </span>
                              <span className="text-sm text-gray-500 mr-1">
                                / يوم
                              </span>
                            </div>
                            <button className="btn-primary py-2 px-4 text-sm">
                              احجز الآن
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List Card
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex">
                        <div className="relative w-64 flex-shrink-0">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/images/car-placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {car.name}
                                </h3>
                                <p className="text-gray-500">
                                  {car.brand} • {car.year}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">
                                  {car.rating}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({car.reviews})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-gray-600">
                              <span className="flex items-center gap-2">
                                <Users className="w-5 h-5" /> {car.seats} مقاعد
                              </span>
                              <span className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />{" "}
                                {car.transmission}
                              </span>
                              <span className="flex items-center gap-2">
                                <Fuel className="w-5 h-5" /> {car.fuelType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <span className="text-3xl font-bold text-primary-600">
                                {formatPrice(car.pricePerDay)}
                              </span>
                              <span className="text-gray-500 mr-1">/ يوم</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(car.id);
                                }}
                                className={`p-3 rounded-xl transition-colors ${
                                  favorites.includes(car.id)
                                    ? "bg-red-50 text-red-500"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                <Heart
                                  className={`w-5 h-5 ${favorites.includes(car.id) ? "fill-current" : ""}`}
                                />
                              </button>
                              <button className="btn-primary">احجز الآن</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {sortedCars.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  لم يتم العثور على سيارات
                </h3>
                <p className="text-gray-600">
                  جرب تغيير معايير البحث أو الفلاتر
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">الفلاتر</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* Same filter content as desktop */}
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">الفئة</h4>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="category-mobile"
                            checked={selectedCategory === cat.id}
                            onChange={() => setSelectedCategory(cat.id)}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span className="text-gray-700">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      السعر اليومي
                    </h4>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([0, parseInt(e.target.value)])
                      }
                      className="w-full accent-primary-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full btn-primary mt-6"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cars;

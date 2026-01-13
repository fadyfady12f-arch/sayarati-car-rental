import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80",
    title: "استأجر سيارة أحلامك",
    subtitle: "اكتشف أسطولنا المتنوع من السيارات الفاخرة والاقتصادية",
    cta: "تصفح السيارات",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    title: "أسعار تنافسية",
    subtitle: "احصل على أفضل العروض والخصومات على جميع سياراتنا",
    cta: "عرض العروض",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1920&q=80",
    title: "خدمة على مدار الساعة",
    subtitle: "فريق دعم متاح 24/7 لخدمتك في أي وقت",
    cta: "تواصل معنا",
  },
];

const stats = [
  { value: "500+", label: "سيارة متاحة" },
  { value: "10K+", label: "عميل سعيد" },
  { value: "15+", label: "فرع في سوريا" },
  { value: "99%", label: "رضا العملاء" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-sm
                           text-primary-300 px-4 py-2 rounded-full border border-primary-500/30"
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">الأفضل في سوريا</span>
                </motion.div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  {slides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                  {slides[currentSlide].subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/cars")}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    {slides[currentSlide].cta}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-white border-2 border-white/30
                             hover:border-white/60 px-6 py-4 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <span>شاهد الفيديو</span>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center
                   text-white hover:bg-white/20 transition-colors pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center
                   text-white hover:bg-white/20 transition-colors pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary-500"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 z-20"
      >
        <div className="container-custom">
          <div className="bg-white/10 backdrop-blur-md rounded-t-2xl border border-white/20 border-b-0">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-white/20">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center py-6 px-4"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

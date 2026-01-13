import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'رجل أعمال',
    avatar: '/images/avatars/avatar1.jpg',
    rating: 5,
    text: 'خدمة ممتازة وسيارات بحالة رائعة. استأجرت مرسيدس E-Class لرحلة عمل وكانت التجربة مثالية. سأعود للتعامل معهم بالتأكيد.',
  },
  {
    id: 2,
    name: 'فاطمة العلي',
    role: 'مهندسة',
    avatar: '/images/avatars/avatar2.jpg',
    rating: 5,
    text: 'أفضل شركة تأجير سيارات في سوريا. الأسعار معقولة والموظفون محترفون جداً. أنصح الجميع بالتعامل معهم.',
  },
  {
    id: 3,
    name: 'محمود الحسن',
    role: 'طبيب',
    avatar: '/images/avatars/avatar3.jpg',
    rating: 5,
    text: 'استأجرت سيارة BMW X5 لرحلة عائلية واستمتعنا كثيراً. السيارة كانت نظيفة ومريحة والخدمة كانت سريعة.',
  },
  {
    id: 4,
    name: 'سارة الخطيب',
    role: 'محامية',
    avatar: '/images/avatars/avatar4.jpg',
    rating: 4,
    text: 'تجربة رائعة! الحجز كان سهلاً وسريعاً عبر الموقع، والسيارة كانت جاهزة في الموعد المحدد بالضبط.',
  },
  {
    id: 5,
    name: 'عمر الشامي',
    role: 'مصور',
    avatar: '/images/avatars/avatar5.jpg',
    rating: 5,
    text: 'أستخدم خدماتهم بشكل دوري لتصوير الأحداث. دائماً ما يقدمون سيارات بحالة ممتازة وأسعار تنافسية.',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            آراء العملاء
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نفخر بثقة عملائنا ونسعى دائماً لتقديم أفضل خدمة
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-8 md:p-10 shadow-lg"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 left-6">
                  <Quote className="w-12 h-12 text-primary-100" />
                </div>

                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">
                    "{testimonials[currentIndex].text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/avatar-placeholder.jpg';
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center
                         shadow-md hover:shadow-lg transition-shadow text-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center
                         shadow-md hover:shadow-lg transition-shadow text-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { value: '4.9', label: 'متوسط التقييم', suffix: '/5' },
            { value: '10K+', label: 'عميل راضٍ', suffix: '' },
            { value: '98%', label: 'نسبة الرضا', suffix: '' },
            { value: '5K+', label: 'تقييم إيجابي', suffix: '' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm"
            >
              <div className="text-3xl font-bold text-primary-600">
                {stat.value}
                <span className="text-lg text-gray-400">{stat.suffix}</span>
              </div>
              <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;

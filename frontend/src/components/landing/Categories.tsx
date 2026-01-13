import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, Zap, Crown, Truck, Users, Bike } from 'lucide-react';

const categories = [
  {
    id: 'economy',
    title: 'اقتصادية',
    description: 'سيارات موفرة للوقود بأسعار مناسبة',
    icon: Car,
    count: 45,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    id: 'sedan',
    title: 'سيدان',
    description: 'راحة وأناقة للرحلات اليومية',
    icon: Car,
    count: 60,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    id: 'suv',
    title: 'SUV',
    description: 'قوة ومساحة للعائلات الكبيرة',
    icon: Truck,
    count: 35,
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    id: 'luxury',
    title: 'فاخرة',
    description: 'تجربة قيادة استثنائية',
    icon: Crown,
    count: 20,
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    id: 'electric',
    title: 'كهربائية',
    description: 'صديقة للبيئة ومستقبلية',
    icon: Zap,
    count: 15,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
  {
    id: 'van',
    title: 'فان',
    description: 'مثالية للمجموعات والرحلات',
    icon: Users,
    count: 25,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
  },
];

const Categories = () => {
  const navigate = useNavigate();

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
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
            تصفح حسب الفئة
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            اختر فئة سيارتك
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نوفر لك مجموعة متنوعة من السيارات لتناسب جميع احتياجاتك وميزانيتك
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/cars?category=${category.id}`)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${category.bgColor} rounded-xl flex items-center justify-center
                                group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className={`w-7 h-7 ${category.textColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.bgColor} ${category.textColor}`}>
                        {category.count} سيارة
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar decoration */}
                <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-gradient-to-l ${category.color}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
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
            onClick={() => navigate('/cars')}
            className="btn-outline"
          >
            عرض جميع السيارات
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;

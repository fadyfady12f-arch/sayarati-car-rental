import { motion } from 'framer-motion';
import { Search, Calendar, Car, Key } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: 'ابحث عن سيارة',
    description: 'تصفح مجموعتنا الواسعة من السيارات واختر ما يناسبك',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    icon: Calendar,
    title: 'حدد الموعد',
    description: 'اختر تاريخ ووقت الاستلام والتسليم المناسب لك',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 3,
    icon: Car,
    title: 'أكمل الحجز',
    description: 'أدخل بياناتك وأكمل عملية الحجز بسهولة',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 4,
    icon: Key,
    title: 'استلم سيارتك',
    description: 'توجه للفرع واستلم مفاتيح سيارتك وانطلق',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
  },
];

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            كيف يعمل
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            احجز سيارتك في 4 خطوات
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نجعل عملية استئجار السيارات سهلة وسريعة لك
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gray-200">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-l from-primary-500 to-primary-300 origin-right"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <div className="relative inline-block mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center
                               shadow-lg mx-auto relative z-10`}
                    >
                      <step.icon className={`w-10 h-10 bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}
                        style={{
                          stroke: 'url(#gradient-' + step.id + ')',
                        }}
                      />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id={`gradient-${step.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={step.color.includes('blue') ? '#3B82F6' :
                                                        step.color.includes('green') ? '#22C55E' :
                                                        step.color.includes('orange') ? '#F97316' : '#A855F7'} />
                            <stop offset="100%" stopColor={step.color.includes('blue') ? '#4F46E5' :
                                                          step.color.includes('green') ? '#059669' :
                                                          step.color.includes('orange') ? '#DC2626' : '#EC4899'} />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    {/* Step Number Badge */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${step.color}
                                  rounded-full flex items-center justify-center text-white font-bold text-sm
                                  shadow-lg z-20`}>
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Mobile/Tablet */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex lg:hidden justify-center my-4">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 text-gray-300"
                    >
                      ↓
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary text-lg px-8 py-4"
          >
            ابدأ البحث الآن
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

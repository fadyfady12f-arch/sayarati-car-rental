import { motion } from 'framer-motion';
import {
  Shield,
  Clock,
  MapPin,
  Headphones,
  CreditCard,
  Award,
  Truck,
  RefreshCcw
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'تأمين شامل',
    description: 'جميع سياراتنا مؤمنة بالكامل لراحة بالك',
  },
  {
    icon: Clock,
    title: 'خدمة 24/7',
    description: 'فريق دعم متاح على مدار الساعة لمساعدتك',
  },
  {
    icon: MapPin,
    title: 'فروع متعددة',
    description: 'استلم وسلم سيارتك من أي فرع في سوريا',
  },
  {
    icon: Headphones,
    title: 'دعم فني',
    description: 'مساعدة على الطريق في حالات الطوارئ',
  },
  {
    icon: CreditCard,
    title: 'دفع آمن',
    description: 'طرق دفع متعددة وآمنة لراحتك',
  },
  {
    icon: Award,
    title: 'جودة مضمونة',
    description: 'سيارات حديثة ومصانة بأعلى المعايير',
  },
  {
    icon: Truck,
    title: 'توصيل مجاني',
    description: 'توصيل السيارة لموقعك بدون رسوم إضافية',
  },
  {
    icon: RefreshCcw,
    title: 'إلغاء مجاني',
    description: 'إلغاء الحجز مجاناً قبل 24 ساعة',
  },
];

const Features = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            لماذا تختارنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            مميزات خدماتنا
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نقدم لك أفضل تجربة استئجار سيارات مع مجموعة من المميزات الحصرية
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 h-full border border-gray-100 hover:border-primary-200
                           shadow-sm hover:shadow-xl transition-all duration-300 text-center">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4
                           group-hover:bg-primary-500 transition-colors duration-300"
                >
                  <feature.icon className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-l from-primary-600 to-primary-500 rounded-2xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                جاهز للانطلاق؟
              </h3>
              <p className="text-primary-100">
                احجز سيارتك الآن واستمتع بأفضل تجربة قيادة
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl
                       hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
            >
              احجز الآن
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

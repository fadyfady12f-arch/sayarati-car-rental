import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

const branches = [
  {
    id: '1',
    name: 'فرع دمشق - المزة',
    city: 'دمشق',
    address: 'شارع المزة، بناء رقم 15، الطابق الأرضي',
    phone: '+963 11 123 4567',
    hours: '8:00 ص - 10:00 م',
    image: '/images/branches/damascus-mazzeh.jpg',
    coordinates: { lat: 33.5138, lng: 36.2765 },
  },
  {
    id: '2',
    name: 'فرع دمشق - المالكي',
    city: 'دمشق',
    address: 'شارع المالكي، بجانب فندق الشام',
    phone: '+963 11 234 5678',
    hours: '8:00 ص - 10:00 م',
    image: '/images/branches/damascus-malki.jpg',
    coordinates: { lat: 33.5127, lng: 36.2801 },
  },
  {
    id: '3',
    name: 'فرع حلب - العزيزية',
    city: 'حلب',
    address: 'حي العزيزية، شارع الجامعة',
    phone: '+963 21 345 6789',
    hours: '9:00 ص - 9:00 م',
    image: '/images/branches/aleppo.jpg',
    coordinates: { lat: 36.2021, lng: 37.1343 },
  },
  {
    id: '4',
    name: 'فرع اللاذقية',
    city: 'اللاذقية',
    address: 'شارع 8 آذار، قرب الكورنيش',
    phone: '+963 41 456 7890',
    hours: '8:00 ص - 8:00 م',
    image: '/images/branches/latakia.jpg',
    coordinates: { lat: 35.5317, lng: 35.7918 },
  },
  {
    id: '5',
    name: 'فرع حمص',
    city: 'حمص',
    address: 'شارع الحمرا، بناء الأمل',
    phone: '+963 31 567 8901',
    hours: '9:00 ص - 8:00 م',
    image: '/images/branches/homs.jpg',
    coordinates: { lat: 34.7324, lng: 36.7137 },
  },
  {
    id: '6',
    name: 'فرع طرطوس',
    city: 'طرطوس',
    address: 'شارع الكورنيش البحري',
    phone: '+963 43 678 9012',
    hours: '9:00 ص - 8:00 م',
    image: '/images/branches/tartus.jpg',
    coordinates: { lat: 34.8959, lng: 35.8867 },
  },
];

const Branches = () => {
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

  const openMap = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
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
            فروعنا
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            نحن قريبون منك
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            فروع منتشرة في جميع أنحاء سوريا لخدمتك بشكل أفضل
          </p>
        </motion.div>

        {/* Branches Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {branches.map((branch) => (
            <motion.div
              key={branch.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/branch-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-primary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {branch.city}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {branch.name}
                  </h3>

                  <div className="space-y-3">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{branch.address}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="text-gray-600 text-sm hover:text-primary-600 transition-colors"
                        dir="ltr"
                      >
                        {branch.phone}
                      </a>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{branch.hours}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openMap(branch.coordinates.lat, branch.coordinates.lng)}
                      className="flex-1 btn-outline py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      الاتجاهات
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 btn-primary py-2 text-sm"
                    >
                      اختر الفرع
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline flex items-center gap-2 mx-auto"
          >
            <MapPin className="w-5 h-5" />
            عرض جميع الفروع على الخريطة
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Branches;

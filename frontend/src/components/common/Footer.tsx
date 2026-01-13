import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Car,
  Clock,
  Shield,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'السيارات', href: '/cars' },
    { label: 'من نحن', href: '/about' },
    { label: 'اتصل بنا', href: '/contact' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
  ];

  const services = [
    { label: 'إيجار يومي', href: '/cars?type=daily' },
    { label: 'إيجار أسبوعي', href: '/cars?type=weekly' },
    { label: 'إيجار شهري', href: '/cars?type=monthly' },
    { label: 'سيارات فاخرة', href: '/cars?category=luxury' },
    { label: 'سيارات اقتصادية', href: '/cars?category=economy' },
  ];

  const policies = [
    { label: 'سياسة الخصوصية', href: '/privacy' },
    { label: 'الشروط والأحكام', href: '/terms' },
    { label: 'سياسة الإلغاء', href: '/cancellation' },
    { label: 'سياسة الاسترداد', href: '/refund' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com', label: 'Youtube' },
  ];

  const features = [
    { icon: Car, text: 'أسطول متنوع' },
    { icon: Clock, text: 'خدمة 24/7' },
    { icon: Shield, text: 'تأمين شامل' },
    { icon: CreditCard, text: 'دفع آمن' },
  ];

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
    <footer className="bg-gray-900 text-white">
      {/* Features Bar */}
      <div className="bg-primary-600">
        <div className="container-custom py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 text-white"
              >
                <feature.icon className="w-5 h-5" />
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container-custom py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">سيارتي</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              نحن شركة رائدة في مجال تأجير السيارات في سوريا، نقدم خدمات متميزة
              وأسطولاً متنوعاً من السيارات لتلبية جميع احتياجاتكم.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center
                           hover:bg-primary-500 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300
                             inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold">خدماتنا</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300
                             inline-block py-1"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  دمشق، سوريا
                  <br />
                  شارع الثورة، بناء رقم 15
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+963111234567"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  dir="ltr"
                >
                  +963 11 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:info@sayarati.sy"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                >
                  info@sayarati.sy
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Policies */}
        <motion.div
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {policies.map((policy, index) => (
              <Link
                key={index}
                to={policy.href}
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                {policy.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-center text-gray-500 text-sm"
        >
          <p>
            © {currentYear} سيارتي. جميع الحقوق محفوظة.
          </p>
          <p className="mt-2">
            صنع بـ ❤️ في سوريا
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;

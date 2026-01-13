import { motion } from "framer-motion";
import {
  Car,
  Users,
  Award,
  Shield,
  Clock,
  MapPin,
  Target,
  Heart,
  Zap,
  CheckCircle,
} from "lucide-react";

const stats = [
  { value: "10+", label: "سنوات خبرة", icon: Award },
  { value: "500+", label: "سيارة", icon: Car },
  { value: "15K+", label: "عميل سعيد", icon: Users },
  { value: "15", label: "فرع في سوريا", icon: MapPin },
];

const values = [
  {
    icon: Shield,
    title: "الأمان أولاً",
    description: "نضمن سلامتك مع صيانة دورية لجميع سياراتنا وتأمين شامل",
  },
  {
    icon: Heart,
    title: "خدمة عملاء متميزة",
    description: "فريق دعم متاح على مدار الساعة لخدمتك في أي وقت",
  },
  {
    icon: Zap,
    title: "سرعة وكفاءة",
    description: "إجراءات حجز سريعة وسهلة مع استلام فوري للسيارة",
  },
  {
    icon: Target,
    title: "الجودة والتميز",
    description: "نقدم أفضل السيارات بأفضل الأسعار دون المساومة على الجودة",
  },
];

const team = [
  {
    name: "أحمد الخالد",
    role: "المدير التنفيذي",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "سارة المحمد",
    role: "مديرة العمليات",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "محمد العلي",
    role: "مدير خدمة العملاء",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "لينا الحسن",
    role: "مديرة التسويق",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
  },
];

const milestones = [
  {
    year: "2014",
    title: "تأسيس الشركة",
    description: "بدأنا رحلتنا بـ 10 سيارات فقط في دمشق",
  },
  {
    year: "2016",
    title: "التوسع الأول",
    description: "افتتحنا فروعاً جديدة في حلب وحمص",
  },
  {
    year: "2018",
    title: "100 سيارة",
    description: "وصل أسطولنا إلى 100 سيارة متنوعة",
  },
  {
    year: "2020",
    title: "الخدمات الرقمية",
    description: "أطلقنا منصتنا الإلكترونية للحجز",
  },
  {
    year: "2024",
    title: "500+ سيارة",
    description: "أصبحنا الشركة الرائدة في سوريا",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              سيارتي هي الشركة الرائدة في مجال تأجير السيارات في سوريا منذ عام
              2014. نقدم خدمات متميزة وأسطولاً متنوعاً من السيارات لتلبية جميع
              احتياجاتكم.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                قصتنا
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                رحلة عقد من الزمن في خدمة عملائنا
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  بدأت رحلتنا في عام 2014 برؤية واضحة: تقديم خدمة تأجير سيارات
                  استثنائية تجمع بين الجودة والسعر المناسب. بدأنا بـ 10 سيارات
                  فقط في مكتب صغير في دمشق.
                </p>
                <p>
                  اليوم، نفخر بامتلاك أسطول يضم أكثر من 500 سيارة متنوعة، من
                  السيارات الاقتصادية إلى الفاخرة، مع 15 فرعاً منتشرة في جميع
                  أنحاء سوريا.
                </p>
                <p>
                  نؤمن بأن كل رحلة تستحق سيارة مميزة، ولذلك نعمل بجد لتوفير أفضل
                  الخيارات لعملائنا مع ضمان أعلى معايير الجودة والسلامة.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1449965408869-ebd3fee56fd8?auto=format&fit=crop&w=800&q=80"
                alt="فريق سيارتي"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm">سنوات من التميز</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              مسيرتنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              محطات في رحلة النجاح
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 right-1/2 w-0.5 bg-primary-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}
                  >
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="text-primary-600 font-bold text-xl mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-primary-500 rounded-full items-center justify-center flex-shrink-0 z-10">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              قيمنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              ما يميزنا عن الآخرين
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نلتزم بمجموعة من القيم التي تجعلنا الخيار الأول لعملائنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              فريقنا
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              تعرف على فريق القيادة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              فريق من الخبراء المتفانين في تقديم أفضل خدمة لعملائنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-primary-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              هل أنت مستعد للانطلاق؟
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              انضم إلى آلاف العملاء الراضين واستمتع بتجربة تأجير سيارات لا مثيل
              لها
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#/cars"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
              >
                تصفح السيارات
              </a>
              <a
                href="#/contact"
                className="btn-outline border-white text-white hover:bg-white/10"
              >
                تواصل معنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

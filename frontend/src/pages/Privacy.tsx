import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, Bell } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'البيانات التي نجمعها',
    content: `نقوم بجمع المعلومات التالية عند استخدامك لخدماتنا:

    • **المعلومات الشخصية**: الاسم الكامل، رقم الهاتف، البريد الإلكتروني، العنوان
    • **معلومات القيادة**: رقم رخصة القيادة، تاريخ الإصدار والانتهاء
    • **معلومات الهوية**: رقم الهوية أو جواز السفر
    • **معلومات الدفع**: تفاصيل البطاقة الائتمانية (مشفرة)
    • **معلومات الحجز**: تواريخ الإيجار، السيارات المحجوزة، الفروع المستخدمة
    • **بيانات الاستخدام**: كيفية تفاعلك مع موقعنا وتطبيقنا`,
  },
  {
    icon: Eye,
    title: 'كيف نستخدم بياناتك',
    content: `نستخدم المعلومات التي نجمعها للأغراض التالية:

    • معالجة حجوزاتك وتقديم خدمات التأجير
    • التواصل معك بشأن حجوزاتك والتحديثات المهمة
    • تحسين خدماتنا وتجربة المستخدم
    • إرسال العروض والتحديثات (بموافقتك)
    • الامتثال للمتطلبات القانونية والتنظيمية
    • منع الاحتيال وضمان أمان خدماتنا`,
  },
  {
    icon: Lock,
    title: 'حماية بياناتك',
    content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:

    • **التشفير**: جميع البيانات الحساسة مشفرة باستخدام SSL/TLS
    • **الوصول المحدود**: فقط الموظفون المخولون يمكنهم الوصول لبياناتك
    • **المراقبة**: نراقب أنظمتنا على مدار الساعة للكشف عن أي نشاط مشبوه
    • **التحديثات الأمنية**: نقوم بتحديث أنظمتنا بانتظام
    • **النسخ الاحتياطي**: نحتفظ بنسخ احتياطية آمنة من بياناتك`,
  },
  {
    icon: UserCheck,
    title: 'حقوقك',
    content: `لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:

    • **الوصول**: يمكنك طلب نسخة من بياناتك الشخصية
    • **التصحيح**: يمكنك طلب تصحيح أي معلومات غير دقيقة
    • **الحذف**: يمكنك طلب حذف بياناتك (مع مراعاة المتطلبات القانونية)
    • **الاعتراض**: يمكنك الاعتراض على معالجة بياناتك لأغراض تسويقية
    • **النقل**: يمكنك طلب نقل بياناتك لمزود خدمة آخر`,
  },
  {
    icon: Bell,
    title: 'ملفات تعريف الارتباط',
    content: `نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك:

    • **ملفات ضرورية**: لتشغيل الموقع بشكل صحيح
    • **ملفات تحليلية**: لفهم كيفية استخدام الموقع
    • **ملفات تسويقية**: لعرض إعلانات مخصصة (بموافقتك)

    يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات متصفحك.`,
  },
  {
    icon: Shield,
    title: 'مشاركة البيانات',
    content: `لا نبيع بياناتك الشخصية لأطراف ثالثة. قد نشارك بياناتك في الحالات التالية:

    • **مزودو الخدمات**: شركات التأمين، معالجي الدفع (بالقدر الضروري فقط)
    • **المتطلبات القانونية**: عند الطلب من السلطات المختصة
    • **حماية حقوقنا**: لمنع الاحتيال أو حماية مصالحنا المشروعة

    جميع الأطراف الثالثة ملزمة بحماية بياناتك وفقاً لسياستنا.`,
  },
];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">سياسة الخصوصية</h1>
            <p className="text-xl text-white/90">
              نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
            </p>
            <p className="text-white/70 mt-4">
              آخر تحديث: يناير 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-lg max-w-none text-gray-600"
            >
              <p className="text-lg leading-relaxed">
                مرحباً بك في سياسة الخصوصية الخاصة بشركة سيارتي لتأجير السيارات.
                نحن نقدر ثقتك بنا ونلتزم بحماية خصوصيتك وبياناتك الشخصية.
                توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك عند استخدام خدماتنا.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">أسئلة حول الخصوصية؟</h2>
            <p className="text-gray-600 mb-6">
              إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو كيفية تعاملنا مع بياناتك،
              يرجى التواصل معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:privacy@sayarati.sy" className="btn-primary">
                privacy@sayarati.sy
              </a>
              <a href="#/contact" className="btn-outline">
                صفحة التواصل
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;

import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, XCircle, DollarSign, Car } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: 'شروط الإيجار الأساسية',
    content: `لاستئجار سيارة من سيارتي، يجب استيفاء الشروط التالية:

    • **العمر**: الحد الأدنى 21 سنة للسيارات العادية، 25 سنة للسيارات الفاخرة
    • **رخصة القيادة**: رخصة سارية المفعول لمدة لا تقل عن سنتين
    • **الهوية**: بطاقة هوية أو جواز سفر ساري المفعول
    • **الدفع**: بطاقة ائتمان أو نقداً مع تأمين مقدم
    • **التوقيع**: توقيع عقد الإيجار والموافقة على الشروط`,
  },
  {
    icon: Car,
    title: 'استخدام السيارة',
    content: `يلتزم المستأجر بالشروط التالية عند استخدام السيارة:

    • استخدام السيارة فقط للأغراض الشخصية المشروعة
    • عدم التدخين داخل السيارة
    • عدم نقل حيوانات أليفة بدون موافقة مسبقة
    • عدم استخدام السيارة في السباقات أو القيادة الخطرة
    • عدم السفر خارج الحدود السورية بدون إذن كتابي
    • الحفاظ على نظافة السيارة وحالتها الجيدة
    • عدم التأجير من الباطن أو السماح لغير المخولين بالقيادة`,
  },
  {
    icon: DollarSign,
    title: 'الأسعار والدفع',
    content: `شروط الدفع والأسعار:

    • **السعر اليومي**: يشمل الكيلومترات المحددة والتأمين الأساسي
    • **التأمين**: مبلغ مقدم قابل للاسترداد عند إرجاع السيارة بحالة جيدة
    • **الكيلومترات الإضافية**: رسوم إضافية لكل كيلومتر يتجاوز الحد المسموح
    • **الوقود**: يجب إرجاع السيارة بنفس مستوى الوقود عند الاستلام
    • **التأخير**: رسوم إضافية عن كل ساعة تأخير (بحد أقصى يوم كامل)
    • **الإلغاء**: حسب سياسة الإلغاء المعلنة`,
  },
  {
    icon: AlertCircle,
    title: 'المسؤوليات',
    content: `مسؤوليات المستأجر:

    • **الحوادث**: الإبلاغ الفوري عن أي حادث والاتصال بالشرطة
    • **الأعطال**: الاتصال بخدمة العملاء فوراً في حالة أي عطل
    • **المخالفات**: تحمل جميع مخالفات المرور خلال فترة الإيجار
    • **الأضرار**: تحمل تكلفة أي أضرار غير مشمولة بالتأمين
    • **السرقة**: الإبلاغ الفوري عن السرقة وتقديم تقرير للشرطة
    • **فقدان المفاتيح**: تحمل تكلفة استبدال المفاتيح`,
  },
  {
    icon: CheckCircle,
    title: 'التأمين والتغطية',
    content: `تفاصيل التغطية التأمينية:

    **التأمين الأساسي (مشمول):**
    • تغطية أضرار الحوادث مع مبلغ تحمل
    • تغطية السرقة الكاملة
    • المسؤولية تجاه الغير

    **التأمين الشامل (اختياري):**
    • تخفيض أو إلغاء مبلغ التحمل
    • تغطية الإطارات والزجاج
    • المساعدة على الطريق

    **غير مشمول:**
    • الأضرار الناتجة عن الإهمال أو سوء الاستخدام
    • القيادة تحت تأثير الكحول أو المخدرات
    • الاستخدام غير المشروع للسيارة`,
  },
  {
    icon: XCircle,
    title: 'الإلغاء والاسترداد',
    content: `سياسة الإلغاء:

    • **قبل 48 ساعة**: إلغاء مجاني واسترداد كامل
    • **24-48 ساعة**: خصم 25% من قيمة الحجز
    • **أقل من 24 ساعة**: خصم 50% من قيمة الحجز
    • **عدم الحضور**: خصم يوم كامل

    **الإرجاع المبكر:**
    • يتم حساب التكلفة الفعلية لأيام الاستخدام
    • استرداد الفرق خلال 7 أيام عمل

    **التمديد:**
    • يجب طلب التمديد قبل 24 ساعة من موعد الإرجاع
    • التمديد خاضع للتوفر وقد تختلف الأسعار`,
  },
];

const Terms = () => {
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
            <FileText className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">الشروط والأحكام</h1>
            <p className="text-xl text-white/90">
              يرجى قراءة الشروط والأحكام بعناية قبل استخدام خدماتنا
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
              className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-yellow-800 mb-2">هام</h3>
                  <p className="text-yellow-700">
                    باستخدامك لخدمات سيارتي، فإنك توافق على الالتزام بهذه الشروط والأحكام.
                    يرجى قراءتها بعناية. إذا كانت لديك أي أسئلة، لا تتردد في التواصل معنا.
                  </p>
                </div>
              </div>
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

      {/* Agreement */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">الموافقة على الشروط</h2>
              <p className="text-gray-600 mb-6">
                بالنقر على "حجز الآن" أو باستخدام خدماتنا، فإنك تؤكد أنك قرأت وفهمت
                ووافقت على الالتزام بهذه الشروط والأحكام.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#/cars" className="btn-primary">
                  تصفح السيارات
                </a>
                <a href="#/contact" className="btn-outline">
                  تواصل معنا
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Terms;

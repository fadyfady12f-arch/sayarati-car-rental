import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Phone } from 'lucide-react';

const faqCategories = [
  { id: 'all', label: 'الكل' },
  { id: 'booking', label: 'الحجز' },
  { id: 'payment', label: 'الدفع' },
  { id: 'requirements', label: 'المتطلبات' },
  { id: 'insurance', label: 'التأمين' },
  { id: 'cancellation', label: 'الإلغاء' },
];

const faqs = [
  {
    id: 1,
    category: 'booking',
    question: 'كيف يمكنني حجز سيارة؟',
    answer: 'يمكنك حجز سيارة بسهولة من خلال موقعنا الإلكتروني أو تطبيق الجوال. اختر السيارة المناسبة، حدد تاريخ الاستلام والتسليم، ثم أكمل عملية الدفع. يمكنك أيضاً الاتصال بنا مباشرة أو زيارة أحد فروعنا.',
  },
  {
    id: 2,
    category: 'booking',
    question: 'هل يمكنني حجز سيارة لشخص آخر؟',
    answer: 'نعم، يمكنك الحجز لشخص آخر بشرط توفر جميع المستندات المطلوبة للسائق الأساسي. يجب تقديم بيانات السائق الفعلي عند الحجز.',
  },
  {
    id: 3,
    category: 'booking',
    question: 'هل يمكنني تعديل الحجز بعد تأكيده؟',
    answer: 'نعم، يمكنك تعديل الحجز قبل 24 ساعة من موعد الاستلام دون أي رسوم إضافية. التعديلات بعد هذا الوقت قد تخضع لرسوم حسب التوفر.',
  },
  {
    id: 4,
    category: 'payment',
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'نقبل الدفع نقداً عند الاستلام، بطاقات الائتمان (فيزا، ماستركارد)، والتحويل البنكي. للحجوزات الطويلة، نوفر خيارات دفع بالتقسيط.',
  },
  {
    id: 5,
    category: 'payment',
    question: 'هل هناك تأمين أو رسوم إضافية؟',
    answer: 'السعر المعروض يشمل التأمين الأساسي. يمكنك اختيار تأمين شامل إضافي برسوم يومية بسيطة. لا توجد رسوم خفية، وجميع التكاليف واضحة عند الحجز.',
  },
  {
    id: 6,
    category: 'payment',
    question: 'هل يتطلب الحجز دفعة مقدمة؟',
    answer: 'نعم، نطلب دفعة مقدمة قابلة للاسترداد عند الحجز. قيمة الدفعة تعتمد على نوع السيارة ومدة الإيجار. يتم استردادها كاملة عند إرجاع السيارة بحالة جيدة.',
  },
  {
    id: 7,
    category: 'requirements',
    question: 'ما هي المستندات المطلوبة لاستلام السيارة؟',
    answer: 'تحتاج إلى: رخصة قيادة سارية المفعول، بطاقة هوية أو جواز سفر، وسيلة دفع صالحة. للأجانب، نقبل رخصة القيادة الدولية أو رخصة بلد المنشأ مع ترجمة معتمدة.',
  },
  {
    id: 8,
    category: 'requirements',
    question: 'ما هو الحد الأدنى للعمر لاستئجار سيارة؟',
    answer: 'الحد الأدنى للعمر هو 21 سنة للسيارات العادية، و25 سنة للسيارات الفاخرة والرياضية. يجب أن يكون لديك خبرة في القيادة لا تقل عن سنتين.',
  },
  {
    id: 9,
    category: 'requirements',
    question: 'هل يمكنني إضافة سائق إضافي؟',
    answer: 'نعم، يمكنك إضافة سائقين إضافيين برسوم يومية بسيطة. يجب على جميع السائقين استيفاء نفس متطلبات السائق الأساسي وتقديم المستندات المطلوبة.',
  },
  {
    id: 10,
    category: 'insurance',
    question: 'ما الذي يغطيه التأمين الأساسي؟',
    answer: 'التأمين الأساسي يغطي الأضرار الناتجة عن الحوادث والسرقة. هناك مبلغ تحمل (excess) يتحمله المستأجر في حالة وقوع حادث. يمكنك تخفيض أو إلغاء هذا المبلغ باختيار التأمين الشامل.',
  },
  {
    id: 11,
    category: 'insurance',
    question: 'هل التأمين يغطي الإطارات والزجاج؟',
    answer: 'التأمين الأساسي لا يغطي أضرار الإطارات والزجاج. للحصول على تغطية شاملة، ننصح باختيار باقة التأمين الشامل التي تغطي جميع الأضرار.',
  },
  {
    id: 12,
    category: 'cancellation',
    question: 'ما هي سياسة الإلغاء؟',
    answer: 'إلغاء مجاني قبل 48 ساعة من موعد الاستلام. إلغاء قبل 24 ساعة يتم خصم 25% من قيمة الحجز. إلغاء في نفس اليوم يتم خصم 50%.',
  },
  {
    id: 13,
    category: 'cancellation',
    question: 'ماذا يحدث إذا تأخرت عن موعد الاستلام؟',
    answer: 'نحتفظ بالسيارة لمدة 3 ساعات من موعد الاستلام المحدد. بعد ذلك، قد يتم إلغاء الحجز. يرجى الاتصال بنا إذا كنت ستتأخر.',
  },
  {
    id: 14,
    category: 'cancellation',
    question: 'هل يمكنني إرجاع السيارة مبكراً؟',
    answer: 'نعم، يمكنك إرجاع السيارة قبل الموعد المحدد. سيتم حساب التكلفة الفعلية لأيام الاستخدام فقط، ويتم رد الفرق إليك.',
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">الأسئلة الشائعة</h1>
            <p className="text-xl text-white/90 mb-8">
              ابحث عن إجابات لأسئلتك الشائعة حول خدمات تأجير السيارات
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن سؤال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container-custom">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
                <p className="text-gray-600">جرب البحث بكلمات مختلفة أو تصفح الفئات</p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-right hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 text-center text-white"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              فريق خدمة العملاء لدينا جاهز لمساعدتك والإجابة على جميع استفساراتك
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#/contact"
                className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
              >
                تواصل معنا
              </a>
              <a
                href="tel:+963111234567"
                className="btn-outline border-white text-white hover:bg-white/10 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                اتصل بنا
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;

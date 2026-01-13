import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-gradient-to-l from-primary-700 via-primary-600 to-primary-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              اشترك في نشرتنا البريدية
            </h2>
            <p className="text-primary-100 mb-8 max-w-xl mx-auto">
              احصل على أحدث العروض والخصومات الحصرية مباشرة في بريدك الإلكتروني
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm"
              >
                <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  شكراً لاشتراكك!
                </h3>
                <p className="text-primary-100">
                  ستصلك أحدث العروض والأخبار قريباً
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full pr-12 pl-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl
                           hover:bg-gray-100 transition-colors flex items-center justify-center gap-2
                           disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      اشترك
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Privacy Note */}
          {!isSubmitted && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-primary-200 text-sm mt-4"
            >
              نحترم خصوصيتك ولن نشارك بريدك الإلكتروني مع أي طرف ثالث
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Car, AlertCircle, User, Phone, Check } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!acceptTerms) {
      return;
    }

    const success = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (success) {
      navigate('/dashboard');
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength <= 1) return 'ضعيفة';
    if (strength === 2) return 'متوسطة';
    if (strength === 3) return 'جيدة';
    return 'قوية';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/auth-bg-2.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              انضم إلينا اليوم
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-primary-100 text-lg max-w-md"
            >
              أنشئ حسابك واستمتع بمزايا حصرية وعروض خاصة
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 space-y-4 text-right"
            >
              {[
                'حجز سريع وسهل',
                'عروض حصرية للأعضاء',
                'تتبع حجوزاتك بسهولة',
                'دعم على مدار الساعة',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-white/90">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">سيارتي</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-600">
              أدخل بياناتك لإنشاء حسابك
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الأول
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="أحمد"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الأخير
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="محمد"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="+963 9XX XXX XXX"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10 pl-10"
                  placeholder="أدخل كلمة المرور"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength() / 4) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{getStrengthText()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input-field pr-10 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">كلمات المرور غير متطابقة</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                أوافق على{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                  الشروط والأحكام
                </Link>{' '}
                و{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !acceptTerms || formData.password !== formData.confirmPassword}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'إنشاء الحساب'
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-8">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
              تسجيل الدخول
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

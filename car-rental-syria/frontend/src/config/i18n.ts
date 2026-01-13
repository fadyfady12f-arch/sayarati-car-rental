import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      cars: 'السيارات',
      pricing: 'الأسعار',
      branches: 'الفروع',
      about: 'من نحن',
      contact: 'اتصل بنا',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',

      // Hero
      heroTitle: 'استأجر سيارة أحلامك في سوريا',
      heroSubtitle: 'أفضل الأسعار • أحدث السيارات • خدمة 24/7',
      searchCar: 'ابحث عن سيارة',

      // Search Form
      pickupLocation: 'موقع الاستلام',
      returnLocation: 'موقع الإرجاع',
      pickupDate: 'تاريخ الاستلام',
      returnDate: 'تاريخ الإرجاع',
      search: 'بحث',

      // Categories
      economy: 'اقتصادية',
      compact: 'صغيرة',
      midsize: 'متوسطة',
      fullsize: 'كبيرة',
      luxury: 'فاخرة',
      suv: 'دفع رباعي',
      van: 'فان',
      pickup: 'بيك أب',
      sports: 'رياضية',
      convertible: 'مكشوفة',

      // Car Details
      seats: 'مقاعد',
      doors: 'أبواب',
      automatic: 'أوتوماتيك',
      manual: 'عادي',
      petrol: 'بنزين',
      diesel: 'ديزل',
      hybrid: 'هايبرد',
      electric: 'كهربائي',
      perDay: '/ يوم',
      bookNow: 'احجز الآن',
      viewDetails: 'التفاصيل',

      // Booking
      bookingDetails: 'تفاصيل الحجز',
      totalDays: 'عدد الأيام',
      dailyRate: 'السعر اليومي',
      subtotal: 'المجموع الفرعي',
      extras: 'الإضافات',
      discount: 'الخصم',
      total: 'الإجمالي',
      deposit: 'التأمين',
      confirmBooking: 'تأكيد الحجز',

      // Status
      pending: 'قيد الانتظار',
      confirmed: 'مؤكد',
      active: 'نشط',
      completed: 'مكتمل',
      cancelled: 'ملغي',

      // Common
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',

      // Auth
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'الكنية',
      phone: 'رقم الهاتف',
      governorate: 'المحافظة',
      forgotPassword: 'نسيت كلمة المرور؟',
      rememberMe: 'تذكرني',

      // Footer
      quickLinks: 'روابط سريعة',
      ourServices: 'خدماتنا',
      contactUs: 'تواصل معنا',
      followUs: 'تابعنا',
      allRightsReserved: 'جميع الحقوق محفوظة',
      privacyPolicy: 'سياسة الخصوصية',
      termsConditions: 'الشروط والأحكام',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

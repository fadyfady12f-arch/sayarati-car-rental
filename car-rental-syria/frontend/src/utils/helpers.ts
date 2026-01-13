import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-SY', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ل.س';
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: ar });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy - HH:mm', { locale: ar });
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar });
};

export const calculateDays = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCategoryName = (category: string): string => {
  const categories: Record<string, string> = {
    ECONOMY: 'اقتصادية',
    COMPACT: 'صغيرة',
    MIDSIZE: 'متوسطة',
    FULLSIZE: 'كبيرة',
    LUXURY: 'فاخرة',
    SUV: 'دفع رباعي',
    VAN: 'فان',
    PICKUP: 'بيك أب',
    SPORTS: 'رياضية',
    CONVERTIBLE: 'مكشوفة',
  };
  return categories[category] || category;
};

export const getTransmissionName = (transmission: string): string => {
  return transmission === 'AUTOMATIC' ? 'أوتوماتيك' : 'عادي';
};

export const getFuelName = (fuel: string): string => {
  const fuels: Record<string, string> = {
    PETROL: 'بنزين',
    DIESEL: 'ديزل',
    HYBRID: 'هايبرد',
    ELECTRIC: 'كهربائي',
    LPG: 'غاز',
  };
  return fuels[fuel] || fuel;
};

export const getStatusName = (status: string): string => {
  const statuses: Record<string, string> = {
    PENDING: 'قيد الانتظار',
    CONFIRMED: 'مؤكد',
    ACTIVE: 'نشط',
    COMPLETED: 'مكتمل',
    CANCELLED: 'ملغي',
    NO_SHOW: 'لم يحضر',
    AVAILABLE: 'متاحة',
    RENTED: 'مؤجرة',
    MAINTENANCE: 'صيانة',
    RESERVED: 'محجوزة',
    UNAVAILABLE: 'غير متاحة',
  };
  return statuses[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
    NO_SHOW: 'bg-red-100 text-red-800',
    AVAILABLE: 'bg-green-100 text-green-800',
    RENTED: 'bg-blue-100 text-blue-800',
    MAINTENANCE: 'bg-orange-100 text-orange-800',
    RESERVED: 'bg-purple-100 text-purple-800',
    UNAVAILABLE: 'bg-gray-100 text-gray-800',
    PAID: 'bg-green-100 text-green-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
    REFUNDED: 'bg-purple-100 text-purple-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getPaymentMethodName = (method: string): string => {
  const methods: Record<string, string> = {
    CASH: 'نقدي',
    BANK_TRANSFER: 'حوالة بنكية',
    CREDIT_CARD: 'بطاقة ائتمان',
    MOBILE_PAYMENT: 'دفع إلكتروني',
  };
  return methods[method] || method;
};

export const governorates = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'حماة',
  'اللاذقية',
  'طرطوس',
  'إدلب',
  'دير الزور',
  'الحسكة',
  'الرقة',
  'درعا',
  'السويداء',
  'القنيطرة',
];

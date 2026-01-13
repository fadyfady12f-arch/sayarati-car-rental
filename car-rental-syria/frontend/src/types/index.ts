// User Types
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'EMPLOYEE';
  isVerified: boolean;
  governorate?: string;
  createdAt: string;
}

// Car Types
export type CarCategory =
  | 'ECONOMY' | 'COMPACT' | 'MIDSIZE' | 'FULLSIZE'
  | 'LUXURY' | 'SUV' | 'VAN' | 'PICKUP' | 'SPORTS' | 'CONVERTIBLE';

export type Transmission = 'AUTOMATIC' | 'MANUAL';
export type FuelType = 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'LPG';
export type CarStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RESERVED' | 'UNAVAILABLE';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  category: CarCategory;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  deposit: number;
  status: CarStatus;
  isActive: boolean;
  isFeatured: boolean;
  mainImage?: string;
  model3dUrl?: string;
  images: CarImage[];
  features: CarFeatureItem[];
  branch?: Branch;
  avgRating: number;
  reviewCount: number;
  isFavorite?: boolean;
}

export interface CarImage {
  id: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

export interface CarFeatureItem {
  id: string;
  feature: Feature;
}

export interface Feature {
  id: string;
  nameAr: string;
  nameEn?: string;
  icon?: string;
  category?: string;
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'REFUNDED' | 'FAILED';

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  user: User;
  carId: string;
  car: Car;
  startDate: string;
  endDate: string;
  actualReturnDate?: string;
  pickupLocation: string;
  returnLocation: string;
  dailyRate: number;
  totalDays: number;
  subtotal: number;
  extrasTotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  depositAmount: number;
  depositReturned: boolean;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  extras: BookingExtraItem[];
  customerNotes?: string;
  adminNotes?: string;
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  review?: Review;
}

export interface BookingExtraItem {
  id: string;
  extra: Extra;
  quantity: number;
  pricePerDay: number;
  totalPrice: number;
}

export interface Extra {
  id: string;
  nameAr: string;
  nameEn?: string;
  description?: string;
  pricePerDay: number;
  icon?: string;
  isActive: boolean;
}

// Branch Types
export interface Branch {
  id: string;
  nameAr: string;
  nameEn?: string;
  address: string;
  city: string;
  governorate: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  openingHours?: Record<string, string>;
  isActive: boolean;
  isMainBranch: boolean;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user: Pick<User, 'firstName' | 'lastName' | 'profileImage'>;
  carId: string;
  bookingId: string;
  rating: number;
  title?: string;
  comment?: string;
  cleanliness?: number;
  comfort?: number;
  performance?: number;
  value?: number;
  isApproved: boolean;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

// Notification Types
export type NotificationType =
  | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'BOOKING_REMINDER'
  | 'PAYMENT_RECEIVED' | 'REVIEW_REQUEST' | 'PROMO' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// Payment Types
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'MOBILE_PAYMENT';

export interface Payment {
  id: string;
  paymentNumber: string;
  bookingId: string;
  booking: Booking;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  receiptUrl?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number;
  minBooking?: number;
  usageLimit?: number;
  usedCount: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  errors?: Array<{ field: string; message: string }>;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  todayBookings: number;
  totalBookings: number;
  pendingBookings: number;
  activeBookings: number;
  todayRevenue: number;
  monthRevenue: number;
  totalCars: number;
  availableCars: number;
  carsInMaintenance: number;
  activeCustomers: number;
  openTickets: number;
}

// Category with count
export interface CategoryWithCount {
  id: CarCategory;
  nameAr: string;
  nameEn: string;
  count: number;
}
